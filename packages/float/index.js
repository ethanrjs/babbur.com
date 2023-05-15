function onReady() {
    const allElements = document.querySelectorAll('*');
    console.log(allElements);
    // loop through all elements
    for (let i = 0; i < allElements.length; i++) {
        // get element
        const element = allElements[i];

        element.style.float = 'left';
        element.display = 'inline-block';
        // https://media.tenor.com/7UarUv_Z1QYAAAAC/gunna-fire.gif
    }
}

window['float_onReady'] = onReady;
