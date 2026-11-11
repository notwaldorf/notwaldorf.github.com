#!/usr/bin/env python3
"""
Scrape a Goodreads "read" shelf and merge new books into an existing YAML file.
Books already in the file (matched by gr_id) are never overwritten.

Goodreads killed the no-key RSS feed, so this logs in with a session cookie and
parses the shelf HTML instead. The cookie is read from the GOODREADS_COOKIE
environment variable (the full `name=value; name=value; ...` Cookie header copied
from a logged-in browser session). Never commit it — store it as a secret.

Usage:
    GOODREADS_COOKIE="..." python parse-goodreads.py
"""

import os
import re
import html as htmllib
import urllib.request
from datetime import datetime


GOODREADS_USER_ID = "27136484"
OUTPUT_FILE = "_data/books.yaml"
PER_PAGE = 100
MAX_PAGES = 50  # safety bound so a bug can't loop forever

SHELF_URL = (
    "https://www.goodreads.com/review/list/{user}"
    "?shelf=read&sort=date_read&order=d&per_page={per_page}&page={page}"
)


def clean_html(text):
    if text is None:
        return ''
    text = re.sub(r'<br\s*/?>', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = htmllib.unescape(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def parse_date(date_str):
    """Convert Goodreads 'Nov 10, 2026' into '2026/11/10'."""
    if not date_str:
        return ''
    try:
        dt = datetime.strptime(date_str.strip(), '%b %d, %Y')
        return dt.strftime('%Y/%m/%d')
    except ValueError:
        return ''


def yaml_str(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def fetch_shelf_page(page, cookie):
    url = SHELF_URL.format(user=GOODREADS_USER_ID, per_page=PER_PAGE, page=page)
    print(f"Fetching {url} ...")
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Cookie': cookie,
    })
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    if '/user/sign_in' in response.geturl():
        raise SystemExit(
            "Goodreads redirected to sign-in: the cookie is missing or expired. "
            "Refresh GOODREADS_COOKIE from a logged-in browser session."
        )
    return html


def field_value(row, name):
    """Return the inner HTML of a `<td class="field NAME">...<div class="value">HERE</div>."""
    m = re.search(
        r'class="field ' + re.escape(name) + r'"[^>]*>.*?class="value"[^>]*>(.*?)</div>',
        row, re.S)
    return m.group(1) if m else ''


def large_image_url(cover_html):
    m = re.search(r'<img[^>]*src="([^"]+)"', cover_html)
    if not m:
        return ''
    url = m.group(1)
    # Strip the thumbnail size suffix (._SX50_ / ._SY75_ / ...) to get the large cover.
    url = re.sub(r'\._S[XY]\d+_(?=\.\w+$)', '', url)
    return url


def parse_review(row, review_id):
    """Prefer the full (hidden) review text; fall back to the truncated container."""
    for span_id in (f'freeTextreview{review_id}', f'freeTextContainerreview{review_id}'):
        m = re.search(r'id="' + re.escape(span_id) + r'"[^>]*>(.*?)</span>', row, re.S)
        if m:
            return clean_html(m.group(1))
    return ''


def parse_books(html):
    books = []
    # Each book is a <tr id="review_NNN" class="bookalike review"> ... </tr>
    rows = re.split(r'<tr id="review_', html)[1:]
    for raw in rows:
        review_id_m = re.match(r'(\d+)"', raw)
        if not review_id_m:
            continue
        review_id = review_id_m.group(1)
        row = raw  # row text runs until the next split; good enough for field regexes

        title_cell = field_value(row, 'title')
        book_id_m = re.search(r'/book/show/(\d+)', title_cell)
        if not book_id_m:
            continue
        book_id = book_id_m.group(1)

        title_raw = clean_html(title_cell)
        # Strip series info like "(Series Name, #1)"
        title = re.sub(r'\s*\([^)]*#\d+[^)]*\)\s*$', '', title_raw).strip()

        # The author anchor text is already "Lastname, Firstname"; taking just the
        # link drops the trailing <span>*</span> "Goodreads Author" marker.
        author_m = re.search(r'/author/show/[^"]*">(.*?)</a>', field_value(row, 'author'), re.S)
        author = clean_html(author_m.group(1)) if author_m else ''

        rating_m = re.search(r'data-rating="(\d+)', field_value(row, 'rating'))
        rating = rating_m.group(1) if rating_m else '0'

        date_m = re.search(r'class="date_read_value">(.*?)</span>', field_value(row, 'date_read'), re.S)
        read_at = parse_date(clean_html(date_m.group(1))) if date_m else ''
        image = large_image_url(field_value(row, 'cover'))
        review = parse_review(row, review_id)

        books.append({
            'gr_id': book_id,
            'title': title,
            'author': author,
            'rating': rating,
            'read': read_at,
            'image': image,
            'review': review,
        })
    return books


def load_existing_ids(output_path):
    """Return a set of gr_id strings already present in the YAML file."""
    if not os.path.exists(output_path):
        return set()
    existing_ids = set()
    with open(output_path, 'r', encoding='utf-8') as f:
        for line in f:
            m = re.match(r'^- gr_id:\s*(\S+)', line)
            if m:
                existing_ids.add(m.group(1))
    return existing_ids


def format_book(b):
    lines = [
        f'- gr_id: {b["gr_id"]}',
        f'  title: "{yaml_str(b["title"])}"',
        f'  author: {b["author"]}',
    ]
    if b['rating'] and b['rating'] != '0':
        lines.append(f'  rating: {b["rating"]}')
    if b['read']:
        lines.append(f'  read: {b["read"]}')
    if b['image']:
        lines.append(f'  image: {b["image"]}')
    if b['review']:
        lines.append(f'  review: "{yaml_str(b["review"])}"')
    lines.append('')  # blank line between entries
    return lines


def main():
    cookie = os.environ.get('GOODREADS_COOKIE', '').strip()
    if not cookie:
        raise SystemExit("GOODREADS_COOKIE is not set.")

    existing_ids = load_existing_ids(OUTPUT_FILE)
    print(f"Found {len(existing_ids)} existing books in {OUTPUT_FILE}")

    new_lines = []
    new_count = 0

    for page in range(1, MAX_PAGES + 1):
        books = parse_books(fetch_shelf_page(page, cookie))
        if not books:
            break  # no more pages

        page_new = 0
        for b in books:
            if b['gr_id'] in existing_ids:
                continue
            existing_ids.add(b['gr_id'])
            new_lines.extend(format_book(b))
            page_new += 1
            new_count += 1

        print(f"Page {page}: {len(books)} books, {page_new} new")
        # Shelf is sorted newest-read first, so once a whole page is already
        # known there's nothing newer further down — stop.
        if page_new == 0:
            break

    if new_count == 0:
        print("No new books to add.")
        return

    existing_content = ""
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            existing_content = f.read()

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(new_lines))
        if existing_content:
            f.write("\n")
            f.write(existing_content)

    print(f"Done. Added {new_count} new books → {OUTPUT_FILE}")


if __name__ == '__main__':
    main()
