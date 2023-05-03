

// Nord theme
const css = `

@import url(https://fonts.googleapis.com/css?family=IBM+Plex+Mono:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic);
* {
    font-family: 'IBM Plex Mono', monospace;
}
.terminal-color-red { color: #bf616a; }
.terminal-color-green { color: #a3be8c; }
.terminal-color-yellow { color: #ebcb8b; }
.terminal-color-blue { color: #81a1c1; }
.terminal-color-magenta { color: #b48ead; }
.terminal-color-cyan { color: #88c0d0; }
.terminal-color-white { color: #e5e9f0; }
.terminal-color-black { color: #4c566a; }

.terminal-bg-color-red { background-color: #bf616a; }
.terminal-bg-color-green { background-color: #a3be8c; }
.terminal-bg-color-yellow { background-color: #ebcb8b; }
.terminal-bg-color-blue { background-color: #81a1c1; }
.terminal-bg-color-magenta { background-color: #b48ead; }
.terminal-bg-color-cyan { background-color: #88c0d0; }
.terminal-bg-color-white { background-color: #e5e9f0; }
.terminal-bg-color-black { background-color: #4c566a; }`;

function onReady() {
    // create <style> element
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}

window["nord_onReady"] = onReady;