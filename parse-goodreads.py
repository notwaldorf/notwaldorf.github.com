#!/usr/bin/env python3
"""
Parse a Goodreads RSS feed and merge new books into an existing YAML file.
Books already in the file (matched by gr_id) are never overwritten.

Usage:
    python parse_goodreads_rss.py
"""

import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime


RSS_URL = "https://www.goodreads.com/review/list_rss/27136484?shelf=read"
OUTPUT_FILE = "_data/books.yaml"


def clean_html(text):
    if text is None:
        return ''
    text = re.sub(r'<br\s*/?>', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>') \
               .replace('&quot;', '"').replace('&#39;', "'")
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def parse_date(date_str):
    if not date_str:
        return ''
    try:
        dt = datetime.strptime(date_str.strip(), '%a, %d %b %Y %H:%M:%S %z')
        return dt.strftime('%Y/%m/%d')
    except ValueError:
        return ''


def yaml_str(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def load_content(source):
    if source.startswith('http://') or source.startswith('https://'):
        print(f"Fetching {source} ...")
        req = urllib.request.Request(source, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    else:
        with open(source, 'r', encoding='utf-8') as f:
            return f.read()


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


def parse_rss(input_path, output_path):
    content = load_content(input_path)

    # Remove the problematic xhtml:meta tag and namespace before parsing
    content = re.sub(r'<xhtml:meta[^>]*/>', '', content)
    content = re.sub(r'xmlns:xhtml="[^"]*"', '', content)

    tree = ET.fromstring(content)
    channel = tree.find('channel')
    items = channel.findall('item')

    existing_ids = load_existing_ids(output_path)
    print(f"Found {len(existing_ids)} existing books in {output_path}")

    new_lines = []
    new_count = 0

    for item in items:
        book_id = item.findtext('book_id', '').strip()
        if book_id in existing_ids:
            continue  # skip duplicates

        title_raw = item.findtext('title', '').strip()
        # Strip series info like "(Series Name, #1)"
        title = re.sub(r'\s*\([^)]*#\d+[^)]*\)\s*$', '', title_raw).strip()

        author = item.findtext('author_name', '').strip()
        # Convert "Firstname Lastname" to "Lastname, Firstname"
        if author and ',' not in author:
            parts = author.rsplit(' ', 1)
            if len(parts) == 2:
                author = f"{parts[1]}, {parts[0]}"

        rating = item.findtext('user_rating', '').strip()
        read_at = parse_date(item.findtext('user_read_at', '').strip())
        review = clean_html(item.findtext('user_review', '').strip())

        new_lines.append(f'- gr_id: {book_id}')
        new_lines.append(f'  title: "{yaml_str(title)}"')
        new_lines.append(f'  author: {author}')
        if rating:
            new_lines.append(f'  rating: {rating}')
        if read_at:
            new_lines.append(f'  read: {read_at}')
        if review:
            new_lines.append(f'  review: "{yaml_str(review)}"')
        new_lines.append('')  # blank line between entries

        new_count += 1

    if new_count == 0:
        print("No new books to add.")
        return

    # Append new entries to the existing file
    with open(output_path, 'a', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

    print(f"Done. Added {new_count} new books → {output_path}")


if __name__ == '__main__':
    parse_rss(RSS_URL, OUTPUT_FILE)