---
layout: post
title: "Hallucinating with art models"
category: posts
draft: true
---
<link type="text/css" rel="stylesheet" href="/css/floatie-bits.css">
<style>
img {
  object-fit:cover;
  transition: transform 0.3s ease-in-out;
  cursor: zoom-in}
img:hover{
  transform: scale(1.5);
  z-index: 1000;
}
@media (max-width: 700px) {
.floatie-bit > img {
    margin-top: 0;
    margin-bottom: 24px;
}  
}
</style>

Wow, long time no blog, eh? Since last I've darkened your feeds with an update, I've been up to a bunch of work/consulting/art/nonsense (primarily Fallout 4; shout out to SteamDecks), to different degrees of success. Since getting off the hamster wheel that is "working for the <s>man</s>Sundar", I've started measuring my self-worth less in terms of internet popularity and more on (and this is true), percent of time spent on naps, and so I've become less interested in talking about myself on the internet (she says, writing a paragraph about herself on the internet). I promise that whatever work I've been doing isn't more interesting than the season of Love Island that just ended, which is waaaaay better edited than my blog posts. Related: Davide? Gross. Grosssssss. 

Anyway, back on track: these text-to-art generative models going about. Surprising nobody, I am extremely into them. I've been using [DALL-E](https://openai.com/dall-e-2/) and [MidJourney](https://www.midjourney.com/home/) since spring and I wanted to give a slightly different overview, from the perspective of someone who isn't interested in their realism skills. I've been trying to post updates on my [artstagram](https://www.instagram.com/meownica.studio/), but as a recent craft fair that just rejected me had to say: I'm quite shit at the socials. 

This post ended up being long af, so here's a table of contents:
* TOC
{:toc}

## Boring uses of interesting models 
I use these models for a very specific thing, and that is as a brainstorming partner/collaborator. This also shouldn't surprise you: I've been going off on using ML for co-creation since the days of working on [Magenta](https://magenta.tensorflow.org/), which was truly a project that forged my views on the topic (shoutout to the smarter-than-me people on the team that let me absorb their well articulated opinions). I think that the most interesting place for ML models in an artist's life is as a tool that specifically **enables**, and doesn't **replace**, creativity. 

What I mean by that is that I find DALL-E generations like "dogs playing poker", "Donald Trump but as a cheeseburger" or "my dog but as a Van Gogh painting" impressive, but kind of boring: yes, the output is funny, but no, I don't fall asleep thinking about the deep meaning of an orange cheeseburger with a balding head and very small hands. This is consistent with how I look at the use of music models like the [Music Transformer](https://magenta.github.io/listen-to-transformer/#a1_50693.mid): absolutely impressive compositions, best suited for an elevator. This isn't the fault of the model, nor its users, and I am truly not shitting on these outputs (unless they're for NFTs; always here to shit on NFTs 🙃): I think both background music and memes have a value in society, as do procedural TV shows (Criminal Minds is literally my favourite ever, and I weeped when Netflix removed it), computer generated or not. But personally, as an artist, I feel fairly emotionally detached from them, as I'm pretty sure their authors do. 

The exact same models, when used in a thoughtful and creative way lead to absolutely brilliant things; the ones that make you say "fuck, I wish **I** had thought of that". Yacht's [album](https://www.wired.com/story/how-yacht-used-machine-learning-to-create-their-new-album/?bxid=5cec28c424c17c4c6463a7e9) made with hard creative rules and machine learning is a wonderful example, as is Karen X. Cheng's use of DALL-E to imagine the scene [beyond Girl with a Pearl Earring](https://twitter.com/karenxcheng/status/1552720889489154048?s=20&t=62SQKCGZANvOlSjOjYMTig). This is the bit that I care about.

As an artist who is trying to carve a place for myself in the art world (and for these models in my art), I want them to be my co-creators, my partners in crime, but not take over and compromise my style. I want us to brainstorm together, come up with ideas, and then (in most cases), mold this draft into something that I can look at and say "yeah, that looks like something I made". I've seen a lot of "is DALL-E or Imagen better at ducks with human legs", but I haven't seen a lot of comparison of these models in terms of their creativity (likely because it's not really quantifiable), so I wanted to do this for myself. Then I spent like two hours on it and thought I might as well put it out there in case anyone else was curious.

## The (barely scientific) method

### Models
I used the 4 models I have access to:
- [DALL-E](https://openai.com/dall-e-2/), via the OpenAI website
- [Stable Diffusion](https://colab.research.google.com/github/huggingface/notebooks/blob/main/diffusers/stable_diffusion.ipynb), via the collab
- [MidJourney](https://www.midjourney.com/home/), via their Discord bot
- [DALL-E mini](https://huggingface.co/spaces/dalle-mini/dalle-mini), via the HuggingFace interface. 

I tried to get a Googler to help me run the prompts on [Imagen](https://imagen.research.google/), but I got no bites, so I have no idea how it fits into this story. 

### Cherry-picking outputs
I cherry-picked 4 images for each model as follows:
- DALL-E: Because using it costs real moneydollars these days, I decided to backfit this experiment to  prompts I've already saved several images for (crucially: this means that I thought the prompt gave interesting enough results for me to care; this is 100% not true of every prompt I try). I also ran each prompt one more time to generate 4 more outputs, and then picked the best 3 out of those. The top left result is always the one I liked the most.
- Stable Diffusion: cherry picked 4 results out of about 9. I also tried to include genuinely shit results (look out for the toucan prompt, woof).
- MidJourney: I ran each prompt twice (getting 8 outputs in total), and then I picked the best 4. I didn't try any parameters or tricks other than just using the prompt itself.

I tried to be as honest as possible with the results I'm showing, because I don't have a dog in this race. I just want something useful *for me*, wherever it comes from. You can zoom over the results to see them slightly bigger.

### What I looked for
The prompts I used are for stuff I am actively working on, so they're a bit weird, slightly personal, and in some cases, oddly disturbing. Please don't steal the prompts or the outputs from me; I can't stop you (such is life on the internet), but it will break my heart. 

I'll have some more details for each prompt, and how I picked "the most interesting to me", but the two big rubrics I looked for were:
1. Did this model interpret the prompt?
2. Would I use one of the model's generations "in an art" (this is very wishy-washy and not scientific; trust me, I get that)

Keep in mind that:
- I understand that in some cases if I spent more time working on the prompt, I might get better results. The way I work is that I don't try to force things into existing -- if they don't work out, I shelve them for a better time.
- Some results are really weird and unsettling, and they've made me dislike my prompt. This isn't the models' faults, or their authors, nor do I have "bad feels" towards the models; it just means I've
accidentally created an uncanny valley and I need to back away from it until I have a better idea of what I actually want from a model. Or maybe not use bees ever again.

## Results
I picked 4 prompts, each of which covering a different area I am interested in:
1. An easy to imagine concept that exists in real life (can it execute?)
2. An easy to imagine concept that **doesn't** exist in real life (can it imagine?)
3. A hard to imagine concept that **doesn't** exist in real life but makes sense linguistically (can it hallucinate a surrealism?)
4. Multiple concepts that exist in real life, glued together in a way that doesn't make sense linguistically nor does it exist it real life (can it be weird?)

I apologize in advance for #3; it's a bad place.

### 1. "Linocut print of a girl bundled up in bed with a stack of books and a cat"
What I am looking for: Something that I can actually carve into linoleum and make prints out of, so sharp lines that I don't have to spend too much time cleaning up is ideal. The suprise winner in this category was Stable Diffusion who despite not interpreting the prompt correctly, came up with the most interesting results (in my opinion, etc)

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/1_dalle.png">
  <p><b>DALL-E</b>. Composition is great (100% gets the prompt), but completely misses the mark on "linocut". I tried to work this into a useable drawing to carve, but because it uses fairly sketchy lines and fills, it ended up being way more work than I wanted.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/1_sd.png">
  <p><b>Stable diffusion</b>. Composition is pretty good but doesn't actually interpret the prompt well. The "linocut" part is really well done -- I find it amazing that the top left image actually has a signature and a title outside of the print! Despite not getting the point, the top right result is my dream come true and what I'll end up using.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/1_mj.png">
  <p><b>MidJourney</b>. Also kind of misses the prompt, and doesn't have as many details as the Stable Diffusion results. I really like the bottom left the most, but I don't think it screams "cat with books" enough for me to use.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/1_mini.png">
  <p><b>DALL-E mini</b>. The results are kind of okay if you squint really hard, but not at all what I'm looking for. I just got laser eyes; I'm not about to go back to squinting.</p>
</div>

### 2. "Lithograph of an orchid where each flower has a small skull inside"
What I am looking for: any semblance of an orchid not looking like an orchid. The "lithograph" part was a very loose requirement -- I just wanted it to feel "pencilly" without looking like a child drew it, which is what DALL-E often does for "pencil drawing". I spent a *lot* of time on this prompt with DALL-E (including looking up the technical biology terms for "the bit inside an orchid flower"), and I never got anything at all correct. It wasn't until this blog post when I went to other models that I regained hope! MidJourney, man!

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/2_dalle.png">
  <p><b>DALL-E</b>. I remember I tried many combinations of writing "a skull inside each flower", and
  all I could ever get out of DALL-E was an orchid next to, or coming out of, a skull. I get bored after about half an hour of failing at a prompt; I'm sure there is a way to write this to get what I'm looking for, but I didn't figure it out, and I lost interest.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/2_sd.png">
  <p><b>Stable diffusion</b>. This one struggled with the prompt too. The bottom two results are really
  pretty, and in particular prettier than the equivalent (and misunderstood) DALL-E results, but still not even in the ballpark of what I was looking for</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/2_mj.png">
  <p><b>MidJourney</b>. I mean, 10/10. These are the spooky orchid boys of my dreams! This prompt came up because I went to an orchid exhibition, and I thought so many of the little flowers looked like skulls or aliens. This was **exactly** what I had in mind. </p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/2_mini.png">
  <p><b>DALL-E mini</b>. Suffers from the same prompt problems as the other models, which makes me think
  that whatever special tweaks MidJourney does to get "creativity" out of a prompt are absolutely
  working.</p>
</div>

### 3. "Erik johansson photograph of a woman hair that is a literal bee hive"
I love surrealism. I was watching this 60s movie where a bunch of women had beehive hairdos, and this is how my brain operates: "wouldn't it be interesting if"? I don't know what I was expecting to get, but it wasn't any of this (though as someone who understands how these models work, I understand **exactly** how we got here). I chose Erik Johansson because surreal photography is his jam, and it helped stir DALL-E towards more of the right vibes at the time. Unfortunately, I got **really** creeped out by most of the results (from all models), and it's really soured up this prompt for me (for now).

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/3_dalle.png">
  <p><b>DALL-E</b>. The uncanny valley of literal bee hives turns out to be deep. The top left image one is the nicest, possibly because a) it doesn't have a face and b) it only has casual bees. It is maybe the closest to what I wanted (out of all the outputs), but it doesn't make me feel great looking at it. </p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/3_sd.png">
  <p><b>Stable diffusion</b>. The people. They look like people. I don't like it. I think the top right one is the least disturbing?</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/3_mj.png">
  <p><b>MidJourney</b>. I find it incredibly fascinating that out of 8 images, they all have the same very specific style. Erik Johannson rarely uses people in his photography -- why is this very specific
  woman coming up? Also, I think the cutesy, not really photographic style really helps these outputs, tbh. </p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/3_mini.png">
  <p><b>DALL-E mini</b>. Poor model, this is the worst of the bunch, and I expected it. DALL-E mini
  isn't very good at realism; it gives very noisy people, or faces. That, combined with (my bad) sheer
  creepiness of the prompt leads to a literal nightmare.</p>
</div>

I cannot apologize enough to these models for making them go through this. You at least could've scrolled past this section; they, the poor darlings, couldn't.

### 4. "A toucan wearing a 60s apron, sitting on a mid century modern armchair, talking on a rotary phone, retrofuturism"
And now, a palette cleanser. I had been doing some reading and learnt that DALL-E really likes commas and stacking up contexts, so that's why this prompt is so detailed.

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/4_dalle.png">
  <p><b>DALL-E</b>. I expected DALL-E to do well, and it delivers. The toucan on the phone is there, the 60s vibe is there, the apron is dubiously missing but we'll give it a pass.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/4_sd.png">
  <p><b>Stable diffusion</b>. I'm not sure what went wrong here. I think the retrofuturism might be 
  muddying the waters a little bit, but all in all: it's toucans doing their thing, some better than others.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/4_mj.png">
  <p><b>MidJourney</b>. If you've ever played with MidJourney, this will strike you as having "very MidJourney vibes". This grainy, round style I see often, and I quite like. However, while it captures the style really nicely, the prompt is sort of a wash past the toucan.</p>
</div>
<hr>

<div class="floatie-bit">
  <img alt="" src="/images/gen-models/4_mini.png">
  <p><b>DALL-E mini</b>. This is the first time I a) love this model the most and b) wish that it produced higher resolution images. Look at the aprons! Look at the furniture! In terms of concept, it's absolute perfection.</p>
</div>

## What have I learned?
I think the most important thing I've learnt from this experiment is that in terms of what I'm looking for (interesting hallucinations and not realism), DALL-E isn't the end-all, be-all of models, and nor is MidJourney. The two freely available models are quite alright in some cases, especially if you're looking for fast and free brainstorming. I think the workflow that I will try out next is to workshop the prompt using StableDiffusion/DALL-E mini, and then take that to the big boi DALL-E herself, and see what I can go from there. 

In terms of model-specific lessons (knowing that it's based on my weird experience with them, they're not scientific and not necessarily applicable to what **you** are working on, etc. Don't come for me, basically):
- MidJourney can be super creative, but can also fall into stylistic pits (see: the bees, the toucan)
- It's hard to get DALL-E out of a realism pit without a ton of effort (see: the skull orchids)
- Stable Diffusion works surprisingly well for something I can run off a collab
- I don't have a gut feeling as to why, but pretty much everyone except for Stable Diffusion is confused by what a linocut is (this is only interesting to me, someone who works on linocuts)
- DALL-E mini really understands what toucans want (JK)
