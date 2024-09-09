---
layout: layout
title: "Books"
splashtitle: "Book reviews"
---

I've been trying to write reviews for every book I've read. 
You can follow these here, on [goodreads](https://www.goodreads.com/user/show/27136484-monica), or as an
[RSS feed](https://www.goodreads.com/review/list_rss/27136484?shelf=read).

<style>
table {
  display: grid;
  border-collapse: collapse;
  grid-template-columns: 2.5fr 2fr 1fr 0.7fr 0.7fr;
  gap: 4px;
  max-width: 100%;
  overflow: scroll;
}
thead,
tbody,
tr {
  display: contents;
}

th,
td {
  font-size: 14px;
}
td.small {
  font-size: 14px;
}
td.center {
  text-align: center;
}
th {
  border-bottom: 3px solid black;
  text-align: left;
  font-size: 16px;
}
td {
  padding-top: 10px;
  padding-bottom: 10px;
}
td a:link, td a:visited {
  color: black;
  text-decoration-color: var(--red);
  text-decoration-thickness: .125em;
}
tr.full {
  display: none;
}
tr.full.show {
  display: contents;
}
tr.full td {
  grid-column: 1 / -1;
  padding: 20px 40px;
  border-left: 3px solid #ddd;
  font-size: 16px;
  line-height: 1.5;
}
button {
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 2px solid var(--red);
  color: black;
}
tr.full td button {
  margin-right: 24px;
}
@media screen and (max-width:600px) {
  table {
    grid-template-columns: 1fr 1fr 0.5fr 0.7fr 0.7fr;
  }
  tr.full td {
    max-width: 80%;
    padding: 16px;
  }
}

</style>
<script>
  function toggleReview(el) {
    const tr = el.parentElement.parentElement;
    const nextTr = tr.nextElementSibling;
    nextTr.classList.toggle('show');
  }
  function hideReview(el) {
    const tr = el.parentElement.parentElement;
    tr.classList.remove('show');
  }
  function copyReview(el) {
    const tr = el.parentElement.parentElement;
    const copyText = tr.querySelector('div').textContent;
    navigator.clipboard.writeText(copyText);
  }
</script>
<table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th>Read</th>
      <th>Rating</th>
      <th>Review</th>
    </tr>
  </thead>
  <tbody>
    {% for book in site.data.books %}
    <tr>
      <td><a href="https://www.goodreads.com/book/show/{{ book.gr_id }}" target="_blank">
      {{ book.title }} </a>
      </td>
      <td>{{ book.author }}</td>
      <td class="small">{{ book.read }}</td>
      <td class="center stars"><b>{{ book.rating }}</b> / 5
      <!-- {%- assign n = book.rating -%}
      {% for i in (1..n) %}★{% endfor %}{% for i in (n..4) %}☆{% endfor %} -->
      </td>
      <td class="center read">
        {% if book.review != "" %}
          <button onclick="toggleReview(this)">read ▿</button>
        {% else %}
          n/a
        {% endif %}
      </td>
    </tr>
    {% if book.review != "" %}
      <tr class="full">
        <td><div>{{ book.review }}</div>
        <br>
        <button onclick="hideReview(this)">close ⌃</button>
        <button onclick="copyReview(this)">copy to clipboard</button>
        </td>
      </tr>
    {% endif %}
    {% endfor %}
  </tbody>
</table>