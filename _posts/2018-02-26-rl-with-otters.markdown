---
layout: post
title: "An intro to Reinforcement Learning (with otters)"
category: posts
draft: true
---

<style>
  img.otter { max-height: 220px !important; }
  iframe.otter {
    height: 800px;
    width: 100%;
    margin: 0 auto;
    border: 5px solid #E0F7FA;
    border-radius: 3px;
  }
</style>

Before I wrote the JavaScripts, I got a master's in AI (almost a decade ago, lolsob),
and wrote a [thesis](/includes/mdinculescu_thesis.pdf)
on a weird and new area in Reinforcement Learning. Or at least it was new then.
It's definitely still weird now. Anyway, I loved it. With all the hype around Machine Learning
and Deep Learning, I thought it would be neat if I wrote a little primer
on what Reinforcement Learning really means, and why it's different than
just another neural net.

Richard Sutton and Andrew Barto wrote an _amazing_ book called
"Reinforcement Learning: an introduction"; it's
my favourite non-fiction book I have ever read in my life, and it's why I fell
in love with RL. The complete draft is available
for free [here](http://incompleteideas.net/book/bookdraft2017nov5.pdf), and if you're into math,
and want to explore this topic further, I can't recommend it enough.

If you're not into math, I have otters.

<img class="otter" alt="otter says hi" src="/images/2018-02-26/0.png">

## What is it?
Reinforcement learning (or RL) solves a very specific problem: figuring out
how to act so that you get the most reward. Both the acting bit and the reward bit
are important components that make RL a "good" approach to solve a problem.

For example, this is perfect if you're a Roomba who is trying to get home
(the only reward you get is if you
  actually get home, so while you're roaming around aimlessly and get no 💰,
  you have a feeeeeeeling you're not doing it right).

On the other hand, this is terrible if you're
  trying to figure out if a photo has an otter in it; there are no
  real actions involved in this problem, other than doing the decision of saying
  "yes iz otter", which means this isn't really a good area for RL.

<img class="otter" alt="i'm doing RL" src="/images/2018-02-26/1.png">

## What isn't it?
There are many things with the word "learning" in them that _aren't_ Reinforcement Learning:
- _supervised learning_. This is a kind of Machine Learning where someone
gave you a training set that has everything labelled correctly, you learn from
it, and hope that at exam time what you've learnt is correct. This is the "I have
1000 images of cats, now I can tell you if this new image is a cat" problem.
- _unsupervised learning_. This is another kind of Machine Learning where
someone gave you a bunch of data with no labels, and just by staring at it you
try to find structure in it and make up labels. This is the "I have 1000 images of
cats and dogs, but nobody told me what a cat or a dog looks like; now I can tell you
if this new image is like what I call a cat or a dog".

[Neural nets](https://en.wikipedia.org/wiki/Artificial_neural_network) are very good at solving these 2 kinds of Machine Learning problems.
If you add neural nets on top of some Reinforcement Learning algorithms, you get something
called _Deep Reinforcement Learning_, which is a brand new area of research that
brought you supercomputers that [win at Go](https://en.wikipedia.org/wiki/AlphaGo), and
secrets straight out of your [nightmares](https://secure.i.telegraph.co.uk/multimedia/archive/03370/doge_3370416k.jpg).


## The world
RL problems are usually set up in an environment that is built out of **states**,
and you can move between them by taking **actions**. Once you take an action,
you're given a **reward**, and you keep doing this until someone
tells you to stop.

In the Roomba example, the states could be the `(x,y)`
positions on the map, and you move between two states (i.e. locations) by moving the
motors in a particular direction. The reward might be set up in such a way that
you only get `1` point if you reach the home base, and `0` otherwise. If there's
particularly dangerous spots in the world you want to make sure the Roomba
learns to avoid (like cliffs or a cat), you can make sure any actions that end
up in those states get a reward of `-1`.

Some environments are less like real worlds and more
like abstract worlds: when you're playing Texas Hold'em poker, the state that you're in
could be the hand that you have, and what cards are on the table, and the actions
could be `folding`, `raising`, `checking`. If you only give a reward at the end of the game (eg.
  "I won this hand or I didn't"), it's very hard to know how you're actually
  doing. These problems have much more complicated reward signals (and tbh, states): how players
  are doing, which are staying, how they're playing, need to be considered.

<img class="otter" alt="this is otterly rewarding" src="/images/2018-02-26/2.png">

**Nerd alert**: If you're interested in the math behind this, the environments are usually
represented by a [Markov Decision Process](https://en.wikipedia.org/wiki/Markov_decision_process) (MDP), or a [Partially Observable
Markov Decision Process](https://en.wikipedia.org/wiki/Partially_observable_Markov_decision_process) (POMDP). The difference between the two is that in the latter case you're not told
exactly what your state in the world is (you're a GPS-less Roomba). You still
know what actions you took, and what reward you're accumulating, but since you
don't know what they _actually_ mean in the world, you have to make up your own
representation of it. These are typically harder and weirder problems, and these
were the ones I was focusing my research on, btw!

## Learning how to act
Ok, so: we're a Roomba, we've been placed somewhere in a world, and we have a
goal: to get home (I think this technically makes us ET, but hey). The thing that
tells us which action to take in a state is our **policy**. If we can figure out
the best action to take in every state in the world, then we have an **optimal
policy**.

<img class="otter" alt="clear eyes, optimal policy, can't lose" src="/images/2018-02-26/3.png">

In order to figure out if a policy is better than another, we need to figure out how "good"
it is to be in a certain state according to that policy (because then you get to compare them:
from this state, one policy leads me to a pot of gold, and one to
sudden death. One is clearly superior). We call this the **value of a state**,
and it's basically the reward we _expect we're going to get_ from that state if
we follow what the policy tells us to do.

The **expected reward** bit is subtle
but hella important: if you just care about immediate reward, a state that doesn't lead you
to instant death sounds pretty good! However, if you keep taking these seemingly-ok-because-they-didn't-kill-us actions,
you might still end up at the edge of the cliff, one step away from instant death. By
considering reward a number of steps away, you throw away shitty trajectories like this.

Most basic RL algorithms try to learn one of these functions:
- the **state-value function**, which is the value of every state in the world. This
is usually called `V` (for value)
- the **action-value function**, which is the value of taking an action from a state,
for all actions and states in the world. This is usually called `Q` (for qaction? lolmath.)

The difference between the two is potentially religious. The **state-value**
function basically says "where you are in the world is important, so figure out
the sequence of good states and follow that". The **action-value** function says "we're in a state, and
some of the actions we can take are awesome, and some are terribad, figure out the awesome ones".

The point of an RL algorithm is to basically learn these functions, and then
pick the one with the highest value: that's your optimal policy!

## How do we learn?
We learn things about the world by exploring the world. You can think about it
as roaming the world in "practice mode", which gives you experience, which helps
you learn what your policy is (what to do in a particular state).
When it's "exam time mode", you use the policy you've learnt and act according
to that. The more data you have, the better you learn.

How you choose to roam the world in practice mode falls in two fundamentally
different areas. Both of these approaches are perfectly valid, and have been mathematically
proven to be optimal (i.e. eventually learn the optimal policy), but I find
them interesting so I wanted to call them out:
- **on-policy learning**: how you move around the world in practice mode
is based on the policy you are learning (so most of the time you tend to explore
  towards the goal).
- **off-policy learning**: how you move around the world in practice mode is
based on some different policy than the one you're learning. Algorithms based
on this approach tend to be a bit slower (read: need more data), but I personally
find them more clear to explain.

<img class="otter" alt="i'm an on policy otter, my policy is to always say yes to food" src="/images/2018-02-26/4.png">

## And now, a code!
My favourite favourite FAVOURITE thing about AI is that if you
do a simple thing, you can get a very satisfying demo. There are tons of Reinforcement
Learning algorithms out there: some are very complicated and take a lot of math. But
some are very simple, and that's the one I [implemented](https://glitch.com/edit/#!/q-learning) for you.

It's called **Q-Learning**, because it learns the `Q` function (if you forgot:
  this is the action-value function, i.e. the value of all of the actions,
  from all of the states). It works like this:
  0. Initialize your `Q` function randomly (so the value of any action from
    any state is a random number). This bit is important so that you don't accidentally
    bias your policy with lies
  1. Start in a random state (call it `S`).
  2. From this state, we need to figure out
  how to move in the world, and spoilers: that's essentially random. We're gonna
  do something slightly fancier called `epsilon-greedy`: most of the time, we're going to move
  according to what the policy says ("greedily"). However, `epsilon` percent of the time, we're going to move randomly. This means that we still get to do some random exploration, which
  is important to make sure we see new states we might not otherwise. Also, `epsilon-greedy` is
  basically what people mean when they say they do things randomly, so you'll
  find it in like literally every RL paper out there.
  3. And...take that action! Once you take it, the world tells you what reward you
  got. Call it `R`. We're going to use this reward to update our `Q` function for
  the state we were in, and the action we took; more precisely: we're going to update our `Q(S,A)`
  value.
  4. The update step is a bit mathy, so I'll spare you it (here's the [relevant code](https://glitch.com/edit/#!/q-learning?path=q-learner.js:73:32) if you want
  to check it out), but the TL;DR is: if this action was a good action,
  then the state that we ended up in should be a better state than the one we
  were currently in (closer to the goal).
  ```
  TODO: that explanation needs to be better words
  ```
  - Now, we're in a new state, so back at Step 2. Repeat Steps 2-4 until you
  end up in a goal state. Once you do (yay!), you can go back to Step 1 and start
  in a new random state (this is important so that you see new parts of the world!).

If you do this enough times, you eventually experience enough of the world that
your `Q` function will tell you what to do!

## Demo
In this demo, we learn by taking [100000 steps](https://glitch.com/edit/#!/q-learning?path=index.html:64:6)
around the world. You can check out that glitch, clone it, and play with the value.
If you take far fewer steps (like 5000), you'll see that your policy is still
pretty random, so your Roomba will get stuck in circles a lot, far away from the goal.
<iframe class="otter" src="https://q-learning.glitch.me/" frameBorder="0"></iframe>

<hr>
Hope this was useful! I wanted to write this post because I read this awesome
[article](https://www.alexirpan.com/2018/02/14/rl-hard.html) by Alex Irpan about
the problems with Deep Learning, but I didn't know who to share it with, because
I don't really hang out with RL researchers anymore. So instead, I decided to
teach you (YES, YOU!) some Reinforcement Learning, so that you can now read
that article and not be lost in it. Yay? Yay!
