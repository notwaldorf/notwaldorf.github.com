---
layout: post
title: "The perils of tensor.dataSync()"
category: posts
---

One of the first things you stumble on when you start using TensorFlow.js is
that sometimes you need your data as a Tensor, and sometimes you need it
as a JavaScript number. Maybe it's for logging it, maybe it's for displaying
it somewhere during training, maybe it's because you don't trust the robots
to be better than you at math.

This is a quick post that tries to clarify why doing this **synchronously**
is probably bad and will leave your UI really janky. [Nikhil](https://twitter.com/nsthorat)
(who like, birthed TensorFlow.js, bless) was kind enough to explain this to me recently, so I figured
I'd return the favour, with fewer meeps and more mistakes.

## Downloading and Uploading
When you create a Tensor, it lives on the CPU. The mere fact that it's a Tensor
doesn't automatically move that data into its GPU mansion -- it needs to be used in a WebGL
program. (I'm playing fast and loose here with the words GPU and CPU btw, so
hold back the pedantics: when I say "it lives on the CPU" I mean "in main memory,
where the CPU processes stuff"; the GPU has it‘s own memory, that's where it
processes stuff, and that’s where that data has to get transferred to.
It's fine. You know I know.)

You **upload** the tensor to the GPU when you call one of the `tf.` operations on it.
Tensor operations are matrix math, and matrix math is really fast on the GPU,
so every time you call something like `sum` or `sqrt` on a Tensor, TensorFlow.js
creates a little [WebGL operation](https://js.tensorflow.org/tutorials/custom-webgl-op.html),
and sends it to the backend. Whatever data lived on the CPU is now
"uploaded" to the GPU (to a WebGL texture).

You **download** a Tensor when you want to get that data from the GPU back onto
the CPU. The data now lives in a WebGL texture, so TensorFlow.js needs to call
[`readPixels`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels)
to ... read... those pixels... from the texture and convert them back into something you can use.
Here's the problem: calling `readPixels` is fundamentally a blocking operation: when you
ask the GPU to give you data, you _have_ to wait for it to respond; this means
you can't really do anything else on the screen while this is happening, like
paint any animations.

TL;DR:
```
const a = tf.tensor();  // a is on the CPU.
const b = a.sqrt();     // Upload a's data to the GPU.
const c = a.dataSync(); // Download a's data from the GPU to the CPU.
```

So the problems here are:

- calling `readPixels` will make your UI janky.
- downloading and uploading from the GPU isn't free, so doing this over and over
is bad news bears.
- downloading from the GPU synchronously over and over is a 2-in-1 and
will probably murder your favourite pet.

## How it works
If you read the latest [`0.15.1`](https://js.tensorflow.org/api/0.15.1/) docs,
you'll discover that there are at least 4 ways of "downloading" your tensor:
- `aTensor.array()` -- asynchronous, and keeps the shape of the tensor (so it returns a nested array)
- `aTensor.arraySync()` -- same as above but **synchronous**
- `aTensor.data()` -- asynchronous and doesn't keep the shape of the tensor (and returns a fancy `Float32Array` like type)
- `aTensor.dataSync()` -- same as above but **synchronous**

Out of these, I personally prefer the new `array` flavours, since I think about my
tensors based on their dimensions, so when they get flattened I get confused.

The difference between the sync and async versions is that:
- for the sync methods, TensorFlow.js just goes ahead and calls `readPixels`,
which instantly blocks and causes sadness.
- for the async methods, it creates a ["fence"](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/fenceSync) (think of it like a fancy WebGL `setTimeout`),
and then calls a different method, [`getBufferSubData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData)
when that fence is hit. Unlike `readPixels`, this doesn't block the UI thread
and it won't cause sadness.

If you, like me, have strange hobbies and want to find this in the actual
TensorFlow.js source code, check out the `read` and `readSync` methods in
[this file](https://github.com/tensorflow/tfjs-core/blob/master/src/kernels/backend_webgl.ts).

## What to do
My advice is:
- if you have to download your data, try to do it once, asynchronously. Do this
at the end, after all your GPU computations are done.
- reach towards the **async** versions first -- that way, even though the
operation is expensive, it won't block the UI and you can do other non-janky
things like letting the user scroll on the page.
- if you really really pinky swear have to use the sync version, just take
another look at the code and see if you can't move that call somewhere else
where it can by async.
