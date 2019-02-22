---
layout: post
title: "TensorFlow.js, dataSync, and why you should be careful"
category: posts
draft: true
---

One of the first things you stumble on when you start using TensorFlow.js is
that sometimes you need your data as a Tensor, and sometimes you need it
as a JavaScript number. Maybe it's for logging it, maybe it's for displaying
it somewhere during training, maybe it's because you don't trust the robots
to be better than you at math.

This is a quick post that tries to clarify why doing this **synchronously**
is probably bad and will leave your UI really janky. [Nikhil](https://twitter.com/nsthorat)
(who like, birthed TensorFlow.js) was kind enough to explain this to me recently, so I figured
I'd return the favour, with fewer meeps and more mistakes.

## Downloading and Uploading
When you create a Tensor, it lives on the CPU. The mere fact that it's a Tensor
doesn't automatically move that data into its GPU mansion -- it needs to be used in a WebGL
program.

You **upload** the tensor to the GPU when you call one of the `tf.` operations on it.
Tensor operations are matrix math, and matrix math is really fast on the GPU,
so every time you call something like `sum` or `sqrt` on a Tensor, TensorFlow.js
creates a little [WebGL operation](https://js.tensorflow.org/tutorials/custom-webgl-op.html),
and sends it to the backend. Whatever data lived on the CPU is now
"uploaded" to the GPU (to a WebGL texture).

You **download** a Tensor when you want to get that data from the GPU back onto
the CPU. The data now lives in a WebGL texture, so TensorFlow.js needs to call
[`readPixels`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels)
to ... read...those pixels... from the texture and convert them back into something you can use.
Here's the problem: calling `readPixels` synchronously is fundamentally a blocking operation: when you
ask the GPU to give you data, you _have_ to wait for it to respond; this means
you can't really do any else on the screen while this is happening, like
paint any animations.

TL;DR:
```
const a = tf.tensor();  // a is on the CPU.
const b = a.sqrt();     // Upload a's data to the GPU.
const c = a.dataSync(); // Download a's data from the GPU.
```

So the problems here are:

- downloading the data synchronously will make your UI janky
- downloading and uploading from the GPU isn't free, so doing this over and over
is bad news bears.

## What to do
If you read the latest [`0.15.1`](https://js.tensorflow.org/api/0.15.1/) docs,
you'll discover that there are at least 4 ways of "downloading" your tensor:
- `aTensor.array()` -- asynchronous, and keeps the shape of the tensor (so it returns a nested array)
- `aTensor.arraySync()` -- same as above but **synchronous**
- `aTensor.data()` -- asynchronous and doesn't keep the shape of the tensor (and returns a fancy `Float32Array` like type)
- `aTensor.dataSync()` -- same as above but **synchronous**

Out of these, I personally prefer the new `array` flavours, since I think about my
tensors based on their dimensions, so when they get flattened I get confused.

Whichever you prefer, I would suggest:

- if you have to download your data, try to do it once, at the end, after all
your GPU computations are done.
- reach towards the **async** versions first -- that way, even though the
operation is expensive, it won't block the UI and you can do other non-janky
things like letting the user scroll on the page.
