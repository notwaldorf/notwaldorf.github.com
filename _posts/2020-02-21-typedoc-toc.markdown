---
layout: post
title: "Fixing typedoc's generated TOC if your code is using ES6 modules"
category: posts
---
My one policy about blogging is “write the blog post you wanted to find in the search results”.
I spent an inordinate amount of time yesterday trying to get `typedoc` to only show the docs
for the files I'm actually exporting in my library, and didn't find anything
on the internet to help me, so here is the blog post I wanted to read.

## The problem
You are working on a JS library. You author your source in TypeScript. You have
an `index.ts` file that exports only some of your source files. You would like
your generated docs from `typedoc` to only have docs for _those_ files (Why? So
that people don't open issues along the lines of "I see the docs for function `foo`,
but I can't see how to call it, pls export it". Sweet child, if that
function was meant to be public it probably would've been. That function is
actually 3 spiders in a trench coat).

That is, you would like your Table of Contents to show this:
<img width="500" alt="Screen Shot 2020-02-20 at 11 01 18 PM" src="https://user-images.githubusercontent.com/1369170/75011632-f396cb80-5434-11ea-97c7-708a94e932fe.png">

and not this:
<img width="500" alt="Screen Shot 2020-02-20 at 11 00 57 PM" src="https://user-images.githubusercontent.com/1369170/75011626-f09bdb00-5434-11ea-859b-ab195c5f1b47.png">

## Things that aren't solutions
In the order that I've tried them:
- the `--mode modules` flag: the word "modules" is a lie here and really just means
"under a namespace" not like... ES6 modules ([tracking issue](https://github.com/TypeStrong/typedoc/issues/109))
- the `--excludeNotExported` flag: it helps to generate docs for only the
exported _functions_, but not files
- the `-excludePrivate` flag: same as above
- the `--exclude` flag: this is nice in theory, but I have like 30+ private
files that shouldn't be documented and only like 5 top level exports, so that regex
will suck. Also, my experience is that next time someone adds a file they want or
don't want documented they won't know to add it to this list and we're back to having a problem
- the `--toc` flag. I honestly don't know what it does, but for me, it did nothing 100% of the time
- thinking this should presently work in `typedoc`. Here is the [tracking issue](https://github.com/TypeStrong/typedoc/issues/639)
and the [open PR](https://github.com/TypeStrong/typedoc/pull/1184) that might fix it.

## My "solution"
I'm less bothered that the docs for the private files get generated at all,
and more bothered that they're linked in the main page TOC and thus discoverable.
So my "solution" that "fixes" it is: inject some JavaScript that hides all the files that aren't
exported in the top level `index.ts`. It's gross, but it's good enough (Also: the
title of my autobiography).

**Disclaimer**: This works for for my library (here's the [PR](https://github.com/tensorflow/magenta-js/pull/409/files#diff-1853dafcee10b39c22a19539ff8fd11cR67) I'm blessing our code
with this horror), but for your particular setup it might need some changes. I
speak very broken bash, so I probably can't help you with those changes.

```sh
# Variables I have:
# Where your source is. We call the script from a different
# place than the index.ts but maybe you don't.
srcDir="..."

# Where you generate the docs. This could be a /docs folder, or a temp one
# because you're going to push to the GitHub gh-pages branch.
# I don't know what you do, I only know what we do (the latter).
docsDir="..."

# The root index.ts file has a bunch of "export * from './foo';" lines.
# Parse those lines into a space separated list of names. It's ok that
# they're space separated, we'll split them in JS,
# this is all a horror anyway. You might have to touch these regexes, sry.
exports=`sed -n "s/export \* from '.\/\(.*\)';/\1/p" $srcDir/src/index.ts`

# If your theme uses a different td class name than the one below,
# inspecting it and update it in the selector. Also my names had
# a bunch of extra quotes, hence the replacing, yours might not.
# This is why I don't want to maintain this.
scriptToFixTheToc="<script> \
const toc = \"$exports\".split(' '); \
const links = document.querySelectorAll('.tsd-kind-external-module'); \
for (let i = 0; i < links.length; i++) { \
  const name = links[i].textContent.trim().replace(/\"/g, ''); \
  if (toc.indexOf(name) === -1) { \
    links[i].parentNode.removeChild(links[i]); \
  } \
} \
</script>"

# Inject that script in the index.html.
echo $scriptToFixTheToc >> $docsDir/index.html

# Pray.
```

<br>
<br>
Like sands through the hourglass so are the hacks of our lives.
