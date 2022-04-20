import './neo.css'
import './style.css'
import Glicol from 'glicol'
import * as g from 'glicol'
import { stack, sequence, Pattern } from '@strudel.cycles/core';
import { mini } from '@strudel.cycles/mini';
import { Scheduler } from "@strudel.cycles/webaudio";

window.stack = stack
window.sequence = sequence;
window.mini = mini;
window.Pattern = Pattern;
window.psampler = g.psampler
window.sin = g.sin
window.saw = g.saw
window.squ = g.squ
window.squ = g.squ
window.noise = g.noise
window.imp = g.imp
window.seq = g.seq
window.speed = g.speed
window.mix = g.mix
window.psynth = g.psynth
window.sig = g.sig

let myTextarea = document.getElementById("code");
window.editor = CodeMirror.fromTextArea(myTextarea, {
    mode: "javascript",
    lineNumbers: true,
    theme: "neo",
    extraKeys: {
        'Ctrl-/': cm => {cm.execCommand('toggleComment')},
        'Cmd-/': cm => {cm.execCommand('toggleComment')}
    }
});

Pattern.prototype.take = function (numSpan) {
    let span = numSpan? numSpan : 1;
    const events = this.queryArc(0, span);
    const spans = events.map(e=> {
        let begin = e.whole.begin.toFraction();
        let pos = begin.includes("/") ?
        parseInt(begin.split("/")[0]) / parseInt(begin.split("/")[1]) : 0
        // parseFloat("808bd") === 808...
        let v = isNaN(e.value) ? "\\"+e.value : parseFloat(e.value)
        return `${v}@${pos}`
    })
    let result = `"${spans.join(" ")}"(${span})`
    // console.log("Pattern.take: ", result);
    return result
}

Pattern.prototype.toGlicol = function (numSpan) {
    let span = numSpan? numSpan : 1;
    const events = this.queryArc(0, span);
    const spans = events.map(e=> {
        let begin = e.whole.begin.toFraction();
        let pos = begin.includes("/") ?
        parseInt(begin.split("/")[0]) / parseInt(begin.split("/")[1]) : 0
        return `${pos} ${e.value}`
    })
    // console.log(spans.join(","))
    return "`"+spans.join(",")+"`"
}

let defaultCode = 
`glicol.play({
  "~t1": psampler(mini("[cb [rm sid] tok*3 talk1]*2").take(1)).mul("~p1"),
  
  "~p1": sig(mini("[1 0.5 0.1 0.9]").take(1)),
  
  o: mix("~t..").plate(0.1)
})

// run "glicol.showAllSamples()" in console to see the loaded samples`

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

editor.setValue(defaultCode)
window.glicol = new Glicol({
    isLiveCoding: true
})

window.scheduler = new Scheduler({
    audioContext: glicol.audioContext,
    interval: 0.01,
    onEvent: (e) => {
        let name = window.msg_target.trackName;
        let index = window.msg_target.nodeIndex
        let m = `${name}, ${index}, 3, ${e.whole.begin.valueOf()}=>${e.value}`
        console.log(m)
        glicol.sendMsg(m)
    }
})

Pattern.prototype.msgGlicol = function(trackName, nodeIndex) {
    window.msg_target = {
        "trackName": trackName,
        "nodeIndex": nodeIndex,
    }
    window.scheduler.setPattern(this);
    if (!window.isSchedulerRunning) {
        window.scheduler.start();
        window.isSchedulerRunning = true;
    }
}

document.getElementById("run").addEventListener("click", ()=>{
    Function(`return ()=>{
        ${window.editor.getValue()}
    }`)()()
})

// document.getElementById("load").addEventListener("click", ()=>{
//     // console.log(document.getElementById("url").value)
//     if (document.getElementById("url").value) {
//         glicol.addSampleFiles(document.getElementById("name").value, document.getElementById("url").value)
//     } else {
//         if (document.getElementById("name").value) {
//             glicol.addSampleFiles(document.getElementById("name").value)
//         }
//     }
// })