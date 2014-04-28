var hud = {}

function createHud() {
    var div = document.createElement('div');
    div.className = 'force';
    div.innerText = 'Force 0';
    document.body.appendChild(div)

    hud.force = div;
}
