import './neo.css'
import './style.css'
import Glicol from 'glicol'
import { sequence, Pattern } from '@strudel.cycles/core';
import { mini } from '@strudel.cycles/mini';

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

Pattern.prototype.to_glicol = function (numSpan) {
    // console.log(this)
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

window.sequence = sequence;
window.mini = mini;
window.Pattern = Pattern;

let defaultCode =
`let span = 1

let pattern = mini("[[60, 63, 71]*2 [62, 65, 70]*3]").to_glicol(span)

glicol.run(\`~t1: p_synth \${pattern} \${span}
>> lpf 1000.0 1.0

~t2: speed 4.0 >> seq 60 >> bd 0.1

out: mix ~t.. >> plate 0.1\`)`;

editor.setValue(defaultCode)
window.glicol = new Glicol();

document.getElementById("run").addEventListener("click", ()=>{
    Function(`return ()=>{
        ${window.editor.getValue()}
    }`)()()
})

// document.getElementById("stop").addEventListener("click", ()=>{
//     glicol.stop()
//     // window.stop(); // stop function binding to window
// })