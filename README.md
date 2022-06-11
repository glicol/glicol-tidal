## What's this?

This is a combination of [Glicol](https://glicol.org) and [Strudel](https://strudel.tidalcycles.org/tutorial/) for using TidalCycles Pattern as signal or scheduler.

## Usage

### Glicol in JS style

I assume you are familiar with Glicol from its website already:
https://glicol.org

Then, all you need to do is to convert it into the JavaScript style:
```JS
glicol.play({
  "~t1": seq("60 _48 _72 67_67").sp("cb").mul(0.1),  
  o: mix("~t..").plate(0.1)
})
```

### Use Pattern as Reference

In Glicol, some Node parameters can be controlled by a `Reference`:

Glicol style:
```
o: sin 440 >> mul ~am
~am: sin 1.1 >> mul 0.3 >> add 0.5
```

JS style:
```JS
glicol.play({
  "o": sin(440).mul("~am"),  
  "~am": sin(1.1).mul(0.3).add(0.5)
})
```

You can now replace that with a `sig` node and use the Tidal Pattern syntax (https://tidalcycles.org/):

```JS
glicol.play({
  "o": sin(440).mul("~am"),  
  "~am": sig( "[1 0.5 0.1 0.9]".take(1) ),
})
```

The example above is not very audio robust but it shows how the Pattern works with Glicol.
The value jumps at certain time and `take` determines the Span of repetition.

So you can use `sig` together with `Pattern.take` to control any modulable node parameters.

### Psampler

Another example is `psampler`, a specially made node to alternate samples:

```JS
glicol.play({
    "~t1": psampler( "[cb [rm sid] tok*3 talk1]*2".take(1) ).mul(0.2),
    "~t2": psampler( "[bin]*4".take(1)).mul(0.2),
    o: mix("~t1 ~t2").plate(0.1)
})
```

## Run locally

```
pnpm i
pnpm dev
```

## Dev note (not for users)
```
sudo pnpm link --dir /usr/local/lib/ glicol
```
