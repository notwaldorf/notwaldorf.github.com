---
layout: post
title: "Static initializers will murder your family"
category: posts
draft: true
---
But only if your family is code.

So this is a bit of a terrible blog post because a) it's about a really obscure atrocity that happens in C++ (as opposed to the other atrocities that happen in C++ on the regs) and b) there's not enough funnies in the world to make up for it. I recommend skipping it if you've just eaten, are feeling light-headed, or don't want to make eye contact with C++. As a general policy, you should probably never make eye contact with C++. It can smell fear.

## Programmer, meet static initializers
We're going to be talking about static class objects, or objects defined in a global/unnamed namespace, such as these fellas:

{% highlight c++ %}
namespace {
static const char* kSquirrel = "sad squirrel";
static const Superhero batman;
}

class Foo {
  static const char* panda_ = "also a sad panda";  
}
{% endhighlight %}

_Static initialization_ is the dance we do when creating these objects. This is not a dance we care about when we initialize things with _constant_ data (like `static int x = 42`); the compiler sees that the thing after the `=` is constant and can't change, so it can inline it. However, if you try to initialize a variable (even a primitive) by running code, then this is not a constant anymore, and it will result in a static initializer. The compile will promise you, however, to run all the  static initializers before the body of `main()` is executed. That, unfortunately, doesn't mean much.

## Why static initializers are bad news bears
As Douglas Adams, the inventor of C++ said, static initializers have "made a lot of people very angry and been widely regarded as a bad move". Apart from being hard to spell, they tend to throw up on your shoes:

  * Static variables in the same _compilation unit_ (or the same file) will be constructed in the order they are defined. This means that this code is predictable, and always does exactly what you think it does. This is also the last of the good news:
{% highlight c++ %}
namespace {
static Superhero batman;
static Superhero robin = batman.getSidekick();
}
{% endhighlight %}

  * Static variables in _different_ translation units are constructed in an undefined order. This is so terrible it has its own name: the [static initialization order fiasco](http://www.parashift.com/c++-faq/static-init-order.html). It goes like this:
  {% highlight c++ %}
  // In x.cpp:
  static Superhero batman;

  // In y.cpp:
  static Superhero robin(batman.getSidekick());
  {% endhighlight %}
  Yup. That's it. Whether `x.cpp` or `y.cpp` gets compiled first is not defined, which means if `y.cpp` gets compiled first, `batman` hasn't been constructed. You know what happens when you call `getSidekick()` on an uninitialized object? Regrets happen.

  * We're not done yet. Why have insanely terrible code when you can have insanely terrible EXPENSIVE code! Evan Martin has a really, really good [post](http://neugierig.org/software/chromium/notes/2011/08/static-initializers.html) about this, but the tl;dr is that because the static initializers need to happen before `main()`, that code needs to be paged, which leads to disk seeks, which leads to awful startup performance. Seriously, read Evan's post because it's amazing.

## Spotting static initializers in the wild: an incomplete manual
Here are some examples of things that are and aren't static initializers, so
that at least we know what we're looking for before we try to fix them.

{% highlight c++ %}
// Both of these are ok, because 0 is a compile time constant, so it can't
// change. The const doesn't make a difference; it's the thing after
// the = sign that makes the difference.
static const int x = 0;
static int y = 0;

// Below, both the pointer and the chars in the string are const, so the
// compiler will treat this as a compile-time constant. So this is ok
// because both the thing before and after the = sign are constant.
static const char const[] panda = "happy panda";

// This, however, calls a constructor, so it's not ok:
static const char* sad_panda("sad panda");

static int a = 0;  
// This is not ok, because the thing after the = sign isn't a const,
// so it can change before b is initialized (I'll explain this too.)
static int b = a;  

// This has to call the Muppet() constructor, and who knows what that
// does, so it's definitely not a const, and a case of the static initializers.
static Muppet waldorf;
{% endhighlight %}


## Them's the breaks
There's a couple of ways in which you can fix this, some better than others:

  * The best static initializer is no static initializer, so try const'ing all your things away. This will take you as far as defining an array of strings, for which you can't pray the initializer away. (Trivia: Praying The Const Away™ is what I call a `const_cast`)
  * Place all your globals in the same compilation unit (i.e. a massive `constants.cpp` file). You can certainly try this, but if your project is the giant Snuffleupagus that Chrome is, you will be laughed at
  * Place the static globals inside the function that needs them (or, if they're the village bicycle, make a getter for them), and define them as function-static variables. Then you know they will be initialized only once, the first time that function is called. Whenever it is called

That last bullet sounds like black magic, so here's an example. This is the static initializer that we are trying to fix. Convince yourself that this code is no good:
{% highlight c++ %}
namespace {
const char* bucket[] = {"apples", "pears", "meerkats"};  
}

const char* GetBucketThing(int i) {
  return bucket[i];
}

{% endhighlight %}

We can fix it by moving `bucket` into `GetBucketThing()`:
{% highlight c++ %}
std::string GetBucketThing(int i) {
  // Sure, it's a non-trivial constructor, but it will get called once,
  // the first time GetBucketThing() gets called, which will be at runtime
  // and therefore a-ok.
  static const std::string bucket[] = {"apples", "pears", "meerkats"};
  return bucket[i];
}
{% endhighlight %}

# ❤︎
I don't know why you've made it this far. Maybe you thought there was going to be a joke or a prize at the end. There isn't. There's just this gif, and you could've just scrolled down for it.

![puppy](http://s3-ec.buzzfed.com/static/2014-04/enhanced/webdr08/3/11/anigif_enhanced-buzz-19981-1396540542-4.gif)
