---
layout: post
title: Why Chromium has code owners
category: posts
draft: true
---
My favourite thing about the Chromium code is this [enum](https://code.google.com/p/chromium/codesearch#chromium/src/chrome/browser/chrome_browser_main_mac.mm&l=44) of cats and all the comments in that file. My second favourite thing is `OWNER` files. Guess what this post is about (hint: it's not about cats NOT EVERYTHING IS ABOUT CATS, OK?)

## Why should you care?
Owners in Chromium are people who own an area of code. This can be a small feature (the `chrome://settings` page) or a giant area (all of the Cocoa UI). You don't *have* to be an owner to be successful -- you get to be an owner because you *want* to. This usually means that you have contributed a lot to that particular nugget of code, have acquired a slightly unhealthy obsession for it (symptoms: if you've whispered "my precious" to a line of code in the last hour, you will make a great code owner one day), and generally care about its well being. I have been trying (unsuccessfully) for years to be an owner of pizza; hit me up if you have any leads.

Owners are gatekeepers of code, and their main responsibility is making sure the code doesn't go to shit. Comments that make sense. No copy pasting, no hacks, no soup for you. None of that "I don't really know how to make this code better so I'm going to merge it and run" nonsense. They are the very model of a modern Major-General, they know the kings of England, and they quote the fights historical. 

TL; DR: owners won't let you merge crappy code. Imagine if each of the 2000 Chromium commiters merged a random hack in one of the 7 million lines of code we have. IMAGINE. 🔥🔥🔥

## What it means for owners
Realtalk: being an owner means that people will send you a lot of code to review, because your blessing (or "LGTM") is required for that code to be committed. [@sky](https://codereview.chromium.org/search?closed=1&owner=&reviewer=sky%40chromium.org&cc=&repo_guid=&base=&project=&private=1&commit=1&created_before=&created_after=&modified_before=&modified_after=&order=&format=html&keys_only=False&with_messages=False&cursor=&limit=30) is an owner of the Windows UI code, and he does something like 500+ reviews a quarter. And also writes code. And helps me out when I (invariably) break the UI. He's pretty much the best.

Basically:

  * People will ask you general questions when they're stuck. It's totally fine not to know the answer -- you'll probably at least know who to point them at.
  * Whenever shit hits the fan and it's on your turf of code, if no obvious culprit is to be found, you win the lottery and get to fix it. Spoiler: this sometimes means fixing things that you didn't actually break. Currently, I'm on day 6 of this giant yak shave that I won by fixing a random crash. Regrets, I am them.
  * You get to live the dream and be picky about code. Don't like a method's name? A particular comment? Think that there's a bit of a refactor needed to make this better? You get to ask for it, and guess what: people usually have to listen. 

👉 Developers trust owners to not be insane. Owners trust developers not to try to land stuff behind their back. This is why it works. 👈

## What it means for developers
First, when you're stuck, you know who to ask questions (an owner!). Second, in order for you to commit any code, you need to get the owners' approval for your changes.

Here's an [example](https://codereview.chromium.org/861053004) of a code review. I like to explicitly [mention](https://codereview.chromium.org/861053004/#msg11) which owner should review which file, because one person might own multiple files/areas in a given CL (if you're a `chrome/browser` owner, you own ALL of the things), but might not be required to review all of them.

So, who owns `profile_info_cache.cc`? Everyone named in the `chrome/browser/profiles/OWNERS` file. On top of that, everyone up the directory tree (so in `chrome/browser/OWNERS`) is also an owner. If you stumble on a directory that doesn't have an owners file (for example `chrome/browser/ui/cocoa/profiles`), just crawl on up until you find the closest one (in this case, you would add an owner from `chrome/browser/ui/cocoa/OWNERS`. This is also useful if you do a fairly innocent refactor that touches a lot of files, like renaming a method. In that case, rather than adding 17 different owners, you can just get one, root owner and run with that.

## How YOU can get owner files in your project
If you want to implement owner files for your projects (YAY!), you need to do a couple of things:

  * Add some sort of presubmit check so that people can't commit code without getting all their ducks in a row. If you give people a chance to merge code under the radar, they will. So, don't.
  * Here's the Chromium [script](https://code.google.com/p/chromium/codesearch#chromium/src/PRESUBMIT.py&l=996). It will probably most likely not work out of the box, but it could be a useful starting point. 
  * Create OWNER files in all the directories that makes sense. Here are [all](https://code.google.com/p/chromium/codesearch#search/&q=OWNERS&type=cs&sq=package:chromium) the Chromium ones.
  * Owner files can have rules [per subdirectory](https://code.google.com/p/chromium/codesearch#chromium/src/chrome/browser/profiles/OWNERS&l=1) but also [per file](https://code.google.com/p/chromium/codesearch#chromium/src/chrome/browser/profiles/OWNERS&l=15). For really tedious file changes (like build files), any committer can be an owner using [wildcards](https://code.google.com/p/chromium/codesearch#chromium/src/chrome/common/OWNERS&l=4)).
  * Make sure the owner files are up to date: when people leave teams, remove them. When people start becoming friendly with an area of code, let them know that ownership is an option.
  * Watch how your code gets better over time.

# ❤︎


