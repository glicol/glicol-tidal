// psampler( "[cb [rm sid] tok*3 talk1]*2".take(1) )

// let defaultCode = `glicol.play({
//     "~t1": psampler(mini("[cb [rm sid] tok*3 talk1]*2").asGlicol(1)),
//     "~t2": psampler(mini("[bin]*4").asGlicol(1)),
//     o: mix("~t1 ~t2").plate(0.1)
// })

// // run "glicol.showAllSamples()" in console to see the loaded samples
// `;

// let _temp = 
// `mini("[60 [63, 67, 70, 72]]").msg_glicol("~t1", 0)

// glicol.run(\`

// ~t1: msgsynth 'saw' 0.01 0.1

// o: mix ~t.. >> plate 0.1

// \`)

// let span = 1
// let pattern = mini("[[60*2 [67,63]*3] [[67,72]*3]]").to_glicol(span)
// let pattern2 = sequence([0, [67, 70]]).fast(2).to_glicol(span)

// glicol.run(\`~t1: psynth \${pattern} \${span}
// >> lpf 1000.0 1.0 >> mul 0.5

// ~t2: psynth \${pattern2} \${span}
// >> lpf 1800.0 1.0 >> mul 0.8

// ~t3: speed 4.0 >> seq 60 >> bd 0.1 >> mul 0.4
// out: mix ~t.. >> plate 0.1\`)`;
