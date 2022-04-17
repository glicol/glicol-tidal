## What's this?

This is a combination of [Glicol](https://glicol.org) and [Strudel](https://strudel.tidalcycles.org/tutorial/).

## Test the scheduler synth

### Step 1

Go to https://glicol-strudel.netlify.app/

### Step 2

- Ignore the things in the editor. Just open the console.
- Open the Web Audio from the tools in the console.
- Write this in the console and run it:
```
glicol.run(`o: msgsynth 'saw' 0.01 0.1`)
```
- Then keep an eye on the time on the Web Audio tool, run this in the console:
```
glicol.send_msg(`o, 0, 3, 10.0=>60; o, 0, 3, 10.0=>67`)
```

You should hear a power chord at 10 second.

## Dev note (not for users)
```
sudo pnpm link --dir /usr/local/lib/ glicol
```