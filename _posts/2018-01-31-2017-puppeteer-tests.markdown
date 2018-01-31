---
layout: post
title: "Automatic visual diffing with Puppeteer"
category: posts
---
So testing, right? We should do it. The thing is, testing is hard, and good testing
is _reaaaaaaally_ hard, and tbh I’m pretty bad at testing. So I end up not
testing my apps, and then I feel guilty about it, but I’ll stop you now:
you can’t run guilt on Travis. If this sounds familiar, then this blog post is for you.

I did a little song-and-dance that sets up [Puppeteer](https://github.com/GoogleChrome/puppeteer)\*
, takes screenshots of your app (like, all the routes you care about), and
then compares them to the "golden" ones. If they match, your test passes!
Yes, it only works on Chrome. No, it’s not
actually unit testing. Yes, it’s literally just counting pixels but you know what?
It counts them in both a wide and a narrow viewport size and any testing is better
than no testing at all; fight me.

\* Puppeteer is an `npm` library that lets you control Chrome. You know, like a puppet.
In particular, Puppeteer makes
  it super easy to take screenshots (and click on things in your page). It's
  like a waaaaaaay less infuriating Selenium, but infinitely harder to spell.

This post looks long because I've put all the code I have so
that you can copy paste it. Skip to the [good](#the-thing-that-does-the-diffing) part
if you already know how to test.

## Do the npm
If you want to test things with Puppeteer, you have to setup a thing for the
tests, a server that launches your site, and then Puppeteer to look
at that site. I have this in my `package.json` to wrangle these things:

```json
"devDependencies": {
  "chai": "^4.1.2",
  "mocha": "^5.0.0",
  "puppeteer": "^1.0.0",
  "pixelmatch": "^4.0.2",
  "polyserve": "^0.23.0"
}
```
Explanation:
- I chose Mocha/Chai for testing because that's what I'm used to. You can
literally use any other testing framework you're comfortable with; I don't think it matters.
- [`Pixelmatch`](https://github.com/mapbox/pixelmatch) is the thing that diffs
two images and tells you how many pixels they differ by. It's super awesome 🏆.
- [`Polyserve`](https://github.com/Polymer/polyserve) is what I use as a local
server. You can use Python or Express or whatever you cool kids use. I'll
point out in the code where it's Polyserve specific (literally 2 lines), and you
can sub in your favourite server there.

## Set up your test
In order to tell Puppeteer to investigate your site, you need to:
1. start a test suite
2. that sets up a local server
3. and in each test tells Puppeteer to do something.

My setup looks like this:
```js
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const {startServer} = require('polyserve');

describe('👀 screenshots are correct', function() {
  let polyserve, browser, page;

  // This is ran when the suite starts up.
  before(async function() {
    // This is where you would substitute your python or Express server or whatever.
    polyserve = await startServer({port:4000});

    // Create the test directory if needed. This and the goldenDir
    // variables are global somewhere.
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

    // And its wide screen/small screen subdirectories.
    if (!fs.existsSync(`${testDir}/wide`)) fs.mkdirSync(`${testDir}/wide`);
    if (!fs.existsSync(`${testDir}/narrow`)) fs.mkdirSync(`${testDir}/narrow`);
  });

  // This is ran when the suite is done.
  after(function(done) {
    // Or stop your server however you want.
    polyserve.close(done);
  });

  // This is ran before every test. It's where you start a clean browser.
  beforeEach(async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  // This is ran after every test; clean up after your browser.
  afterEach(async function() {
    await browser.close();
  });

  // Wide screen tests!
  describe('wide screen', function() {
    beforeEach(async function() {
      await page.setViewport({width: 800, height: 600});
    });
    it('/view1', async function() {
      await takeAndCompareScreenshot(page, 'view1', 'wide');
    });
    // And your other routes, 404, etc.
  });

  // Narrow screen tests are the same, but with a different viewport.
  describe('narrow screen', function() {
    beforeEach(async function() {
      await page.setViewport({width: 375, height: 667});
    });
    it('/view1', async function() {
      await takeAndCompareScreenshot(page, 'view1', 'narrow');
    });
    // And your other routes, 404, etc.
  });
});
```

## Filing in the blanks
All the heavy lifting (which isn't very heavy tbh) is done in `takeAndCompareScreenshot`:

```js
// - page is a reference to the Puppeteer page.
// - route is the path you're loading, which I'm using to name the file.
// - filePrefix is either "wide" or "narrow", since I'm automatically testing both.
async function takeAndCompareScreenshot(page, route, filePrefix) {
  // If you didn't specify a file, use the name of the route.
  let fileName = filePrefix + '/' + (route ? route : 'index');

  // Start the browser, go to that page, and take a screenshot.
  await page.goto(`http://127.0.0.1:4000/${route}`);
  await page.screenshot({path: `${testDir}/${fileName}.png`});

  // Test to see if it's right.
  await compareScreenshots(fileName);
}
```

### Getting the golden screenshots
This bit is easy. Make a different test suite (just make sure you don't run it every time you
run your tests), and run the `page.goto` and `page.screenshot` lines for all
the routes you're testing. I recommend doing the viewport dance too, to get both the
  wide and narrow screen ones _for freeeeee_. Put all these screenshots in a place; I put mine in
  a folder called `test/screenshots-golden/`.

### The thing that does the diffing
This is the logic in `compareScreenshots`, and it's basically straight
out of the [`Pixelmatch` docs](https://github.com/mapbox/pixelmatch#nodejs):

```js
function compareScreenshots(fileName) {
  return new Promise((resolve, reject) => {
    var img1 = fs.createReadStream(`${testDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
    var img2 = fs.createReadStream(`${goldenDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

    var filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);

      // Do the visual diff.
      var diff = new PNG({width: img1.width, height: img2.height});
      var numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          {threshold: 0.1});

      // The files should look the same.
      expect(numDiffPixels, 'number of different pixels').equal(0);
      resolve();
    }
  });
}

```

## 💯 It's all worth it
Now, when you run your tests (`mocha test/ --timeout 5000` in my case), you get
something like this:

<img width="340" alt="10/10 passing tests" src="https://user-images.githubusercontent.com/1369170/35607089-624a2f28-0607-11e8-9448-0af2c40fe31a.png">

And if it fails, you get an error and the number of pixels you're off by.

## ⭐️
Now go on, navigate to all your routes and test your stuff, and thank me
with a photo of your dog.
