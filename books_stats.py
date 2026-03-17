#!/usr/bin/env python3
"""
Read books.yaml and print per-year stats: books read and average rating.

Usage:
    python book_stats.py
"""

import re
import statistics
from collections import defaultdict

BOOKS_FILE = "_data/books.yaml"


def parse_books(path):
    books = []
    current = {}
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            if line.startswith('- gr_id:'):
                if current:
                    books.append(current)
                current = {}
            m = re.match(r'^\s{2}(\w+):\s*(.*)', line)
            if m:
                current[m.group(1)] = m.group(2).strip().strip('"')
    if current:
        books.append(current)
    return books


def main():
    books = parse_books(BOOKS_FILE)

    by_year = defaultdict(list)
    no_date = 0

    for b in books:
        read = b.get('read', '')
        if not read:
            no_date += 1
            continue
        year = read.split('/')[0]
        rating = b.get('rating', '')
        by_year[year].append(int(rating) if rating and rating != '0' else None)

    print(f"{'Year':<6}  {'Books':>5}  {'Avg Rating':>10}  {'Std Dev':>7}")
    print("-" * 36)
    for year in sorted(by_year.keys(), reverse=True):
        ratings = by_year[year]
        count = len(ratings)
        rated = [r for r in ratings if r is not None]
        avg = sum(rated) / len(rated) if rated else None
        avg_str = f"{avg:.2f}" if avg is not None else "  n/a"
        std_str = f"{statistics.stdev(rated):.2f}" if len(rated) >= 2 else "  n/a"
        print(f"{year:<6}  {count:>5}  {avg_str:>10}  {std_str:>7}")

    print("-" * 36)
    print(f"{'Total':<6}  {len(books):>5}")
    if no_date:
        print(f"({no_date} books with no read date excluded from year counts)")


if __name__ == '__main__':
    main()