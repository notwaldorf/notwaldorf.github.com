---
layout: post
title: "Hello tensorflow"
category: posts
---

<style>
  iframe {
    height: 640px;
    width: 100%;
    margin: 0 auto;
    border: 5px solid #E0F7FA;
    border-radius: 3px;
  }
</style>

**Machine Learning (ML)** is the dope new thing that everyone's talking about, because it's really good
at learning from data so that it can predict similar things in the future. Doing ML by hand is pretty annoying
since it usually involves matrix math which is zero fun in JavaScript (or if you ask me: anywhere 😅).
Thankfully, [TensorFlow.js](https://js.tensorflow.org/) is here to help! It's
an open source library that has a lot of built-in Machine Learning-y things like models and algorithms so that
you don't have to write them from scratch.

## Is your problem a Machine Learning problem?

Machine learning is good at classifying and labelling data. The premise of every machine learning problem is:

* Someone gives us some data that was generated according to a **secret** formula. This data could be a bunch of points (that are generated based on some math equation), but could also be fun, like images (the secret formula could be "some of these images are chihuahuas and some are
  [blueberry muffins](https://mashable.com/2016/03/10/dog-or-muffin-meme/#LjBd4.e9lgqJ)) or bus schedules.
* By looking at this data we were given, we approximate the secret formula so that we can correctly predict a future data point. For example, if we're given a photo, we will eventually be able to confidently say whether it's a dog or a muffin.

## A fun demo!

If you want to get started, predicting numbers tends to be easier than
predicting images, so in this example we're trying to fit a curve to a bunch of
data (this is the same example from the
[TensorFlow](https://js.tensorflow.org/tutorials/fit-curve.html)
site but with waaaaay more code comments and a prettier graph).

We are given a bunch of points (for `x` between -1 and 1, calculate a `y` according to
`y = a * x^3 + b * x^2 + c * x + d` -- we know this is the secret formula but we don't know the
values of those `a,b,c,d` coefficients.)
Our goal is to learn these coefficients, so that if we're given a new `x` value, we can say what the `y` value should be.

The **blue** dots are the training points we were given. The **red** dots would be our guesses,
based on our initial, default coefficients (hella incorrect!). Once you click the `train`
button, the **green** dots show how our coefficients are getting better. After you see the default
example, check what happens if you change the shape of the data, or we are given fewer data points or fewer iterations!

<iframe src="https://hello-tensorflow.glitch.me/index.html#demo-content" frameBorder="0"
scrolling="no"></iframe>

## How it works

Most machine learning algorithms follow this pattern:

* We have to figure out the **"features"** of the secret formula that generated the data we were given, so that we
  can learn them. In my opinion, this is like 80% of the complexity of solving an ML problem. In this example, we were told the shape of the secret formula (it's a cubic!), so the features we have to learn are the coefficients in the polynomial. For something more
  complex like the "is this a dog or a blueberry muffin" problem, we'd have to look at pixels and colours and formations and what
  makes a dog a dog and not a muffin.
* Once we figure out these features (in our case, those `a,b,c,d` coefficients), we initialize them to some random values. We could now use them to make
  predictions, but they would be teeeeeerrible because they're just random.
* (I'm just going to use our actual example from now on and
  not dogs)
* We start looking at every piece `(x,y)` of training data we were given. We take the `x` value, and based on these coefficients we have estimated, we predict what the `y` value would be.
  We then look at the correct `y` value from the original training data, calculate the
  difference between the two, and then adjust our coefficients so that our predicted value gets closer to the correct one.
* (this, with more math sprinkled in is called "stochastic gradient descent". "Stochastic" means probabilistic, and
  "gradient descent" should make you think of walking down a hill, towards a sink hole -- the higher the hill, the bigger the prediction error, which is why you want to descend towards the error-free hole.)
* This part of code is actually pretty messy (because matrices and derivatives), and TensorFlow does this for us!
* We keep doing this until we use up all the data, and then repeat the entire process so that we iterate over the same data over
  and over again until at the end we've pretty much learnt the coefficients!

## The code

You can look at the code for the demo [on Glitch](https://glitch.com/edit/#!/hello-tensorflow?path=script.js:95:10). I tried to comment
most lines of the code with either what the algorithm or TensorFlow are doing (especially when
TensorFlow is actually doing a looooot of heavy lifting behind the scenes). I hope it helps!
