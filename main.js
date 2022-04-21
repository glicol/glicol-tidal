import './neo.css'
import './style.css'
import Glicol from 'glicol'
import * as g from 'glicol'
import * as p from '@strudel.cycles/core';
import { mini } from '@strudel.cycles/mini';
import { Scheduler } from "@strudel.cycles/webaudio";

Object.keys(g).forEach(e=> window[e] = g[e] )
Object.keys(p).forEach(e=> window[e] = p[e] )

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

Pattern.prototype.take = function(numSpan) {
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

String.prototype.take = function(numSpan) {
    // console.log(this, numSpan)
    return mini(this).take(numSpan)
}

let defaultCode = 
`"[120 240]*2".onEvent(e=>glicol.setBPM(e.value))

glicol.play({
  "~t1": seq("60 _48 _72 67_67").sp("cb").mul("~p1"),
  
  "~p1": sig( "[1 0.5 0.1 0.9]".take(1) ),
  
  o: mix("~t..").plate(0.1)
})

// run "glicol.showAllSamples()" in console to see the loaded samples`

editor.setValue(defaultCode)
window.glicol = new Glicol({
    isLiveCoding: true,
    loadSamples: true
})

window.closure = e => console.log(e)

window.scheduler = new Scheduler({
    audioContext: glicol.audioContext,
    interval: 0.01,
    onEvent: (e)=>{
        window.closure(e)
    }   
        // let name = window.msg_target.trackName;
        // let index = window.msg_target.nodeIndex
        // let m = `${name}, ${index}, 3, ${e.whole.begin.valueOf()}=>${e.value}`
        // console.log(m)
        // glicol.sendMsg(m)
    // }
})

// Pattern.prototype.msgGlicol = function(trackName, nodeIndex) {
//     window.msg_target = {
//         "trackName": trackName,
//         "nodeIndex": nodeIndex,
//     }
//     window.scheduler.setPattern(this);
//     if (!window.isSchedulerRunning) {
//         window.scheduler.start();
//         window.isSchedulerRunning = true;
//     }
// }

String.prototype.onEvent = function(c) {
    console.log(this, c)
    window.closure = c
    console.log(this, window.closure)
    window.scheduler.setPattern(mini(this));
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