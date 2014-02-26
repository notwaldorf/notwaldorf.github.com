---
layout: post
title: "When pull requests get tricky"
category: posts
draft: true
---

Imagine this: you have forked a repo a long time ago and have since been in a happily committed relationship with the master branch, modifying files and committing from the hip.

In case you have doubts about the likelihood of this scenario, we're talking about my `notwaldorf.github.com` blog branch, which I forked from `holman/left`. All my changes are on the master branch so that GitHub can do its magic gh-pages trick and just Make Things Work™. This could also happen for repos you've forked and mucked around with, but never thought you'd ever contribute to.

Because you're a good open sorcerer, you might, at some point, want to send a pull request to fix a thing in the original repo. If you're anything like I am, you are now in a bit of a terrible situation because your fork's tip of tree has advanced and diverged quite a bit from the upstream repo, so any pull requests you send out will be polluted with code that doesn't belong in them.

At this point, you probably have some regrets. Let's not dwell on them. Here's the set of steps that will help you navigate this minefield you find yourself in. They're not special; I just couldn't find them all in one place, and wanted a summary for the future.

## Set up your upstream 
If `git remote` doesn't show you a branch called `upstream`, you need to add one:
<pre>
git remote add upstream https://github.com/user/repo_you_forked.git
</pre>

## Set up a clean branch for your fix
Step into your tardis and branch from when you were last in sync with the upstream. In my case, this was when I initially created my fork. 
A dull perusing of `git log` or `git reflog` should point you to the right sha. Then,

<pre>
git checkout -b pr_branch
git reset --hard sha_from_the_past
</pre>

## Get your changes in
Here you have two options. If your changes are tiny, or you know exactly what they are, you can just manually reapply them. And by that I mean copy paste the changes into the right files, like a barbarian. For the record, this is my preferred approach. I am a barbarian. I live in the git stone age. 

Althernatively, you can go the fancy route with 

<pre>
git checkout -p master file_to_modify
</pre>

This will look at the diff between master (which is in the future), and your working copy (we are in the past) and let you pick and choose individual hunks. Having taken a moment and appreciated how amazing this last sentence was, you can:

* hit *s* to split the hunks into smaller hunks
* hit *y* or *n* to pick or skip a hunk.

If you've touched any files, it's a good time for your familiar `git add/git commit` dance.

## Merge the upstream changes in
<pre>
git fetch upstream  # You won't see any changes in git log. Don't panic yet.
git merge upstream/master  # Some wild upstream changes appear in git log.
</pre>

## ♫ ♪ T-t-t-test your cha-an-ges ♫ ♪

## Upload your change
This is the last step. If you want, you can rename your branch before uploading it. I usually do, because my original branch names tend to be silly. After this, you can go and look at your branch in GitHub and be delighted with the progress you've made. Time to send out that pull request!

<pre>
git push origin pr_branch:possibly_new_branch_name
</pre>

## Hope this helped!



