---
layout: layout
title: "Books"
splashtitle: "Book reviews"
---

Since 2019-ish I've been trying to write reviews for every book I read. 
You can follow these here, on [Goodreads](https://www.goodreads.com/user/show/27136484-monica), or as an
[RSS feed](https://www.goodreads.com/review/list_rss/27136484?shelf=read). I used to try 
to only read "good" literary fiction, but life is short, I am tired, and now that mix is eclectic. I try to be fair in reviews and not take away stars because a book is trash (in my universe, both Sally Rooney and Fourth Wing can get 5 stars).

<style>
table {
  display: grid;
  border-collapse: collapse;
  gap: 4px;
  max-width: 100%;
  overflow: scroll;
}
table.small {
  grid-template-columns: 1fr 8fr;
}
table.all {
  grid-template-columns: 2.5fr 2fr 1fr 0.7fr 0.7fr;
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
table.all td {
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
  table.all {
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


Ratings explained:
<table class="small">
<tbody>
<tr>
  <td>5 / 5</td>
  <td>Loved it a lot, would reread</td>
</tr>
<tr>
  <td>4 / 5</td>
  <td>I liked it, but I probably won't reread it again</td>
</tr>
<tr>
  <td>3 / 5</td>
  <td>It was fine. It wasn't amazing but it was a fun read and I don't regret reading it</td>
</tr>
<tr>
  <td>2 / 5</td>
  <td>I didn't like this *at all* and I'll probably say it was badly written</td>
</tr>
<tr>
  <td>1 / 5</td>
  <td>This book literally pissed me off</td>
</tr>
<tr>
  <td>n / a</td>
  <td>I didn't feel comfortable rating this book because it was either about facts, or I didn't finish it (which doesn't necessarily mean I didn't love it; I'm looking at you John Banville.)
  </td>
</tr>
</tbody>
</table>

<br>
<table class="all">
  <thead>
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th>Finished</th>
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
      <td class="center stars">
        {% if book.rating != 0 %}
          <b>{{ book.rating }}</b> / 5
        {% else %}
          n/a
        {% endif %}
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
