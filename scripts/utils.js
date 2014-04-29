function createHtmlElement(type, parent, className, text) {
    var elm = document.createElement(type);
    elm.className = className;
    if (text) { elm.innerText = text; }
    parent.appendChild(elm)

    return elm;
}


function textSprite(text, params) {
    var font = "Verdana",
        size = 20,
        color = "#fff";

    font = "bold " + size + "px " + font;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = font;

    // get size data (height depends only on font size)
    var metrics = context.measureText(text),
        textWidth = metrics.width;

    canvas.width = 64;//textWidth + 3;
    canvas.height = 64;//size + 3;

    context.font = font;
    context.fillStyle = color;
    context.textAlign="center";
    context.fillText(text, canvas.width / 2, canvas.height / 2); // size + 3

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.SpriteMaterial( { map: texture, transparent: true, useScreenCoordinates: true } ); // , color: 0xffffff, fog: true
    var sprite = new THREE.Sprite( material );
    //scene.add( sprite );

    /*var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas.width, canvas.height),
        new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        }));*/

    //console.log(canvas.width + 'x' + canvas.height);
    //console.log(texture);
    //console.log(mesh);

    return sprite;
}

function toXYCoords (pos) {
    var vector = projector.projectVector(pos.clone(), camera);
    vector.x = (vector.x + 1)/2 * window.innerWidth;
    vector.y = -(vector.y - 1)/2 * window.innerHeight;
    return vector;
}


function moveObjectTo(obj, point, delay, time, hasPhysics, onComplete, onUpdate) {
    // stop previous move tween
    if (obj.tweens.move) { obj.tweens.move.stop(); }

    // multiply time per distance
    time *= obj.position.distanceTo(point);

    // tween object
    obj.tweens.move = new TWEEN.Tween(obj.position)
        .to(point, time).delay(delay)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () {
            obj.tweens.move = null;
            if (onComplete) { onComplete(); }
        })
        .start();

    // enable dirty flags
    if (hasPhysics) {
        obj.__dirtyRotation = true;
        obj.__dirtyPosition = true;

        obj.tweens.move.onUpdate(function () {
            obj.__dirtyRotation = true;
            obj.__dirtyPosition = true;
            if (onUpdate) { onUpdate(); }
        })
    }

    return obj.tweens.move;
}


function rotateObjectTo(obj, angle, delay, time, hasPhysics, cb) {
    // stop previous tween
    if (obj.tweens.rotate) { obj.tweens.rotate.stop(); }

    // get from/to angles
    //var angleFrom = { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z };
    var angleTo = { x: angle.x, y: angle.y, z: angle.z };

    // tween object
    obj.tweens.rotate = new TWEEN.Tween(obj.rotation) // angleFrom
        .to(angleTo, time).delay(delay)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () {
            obj.tweens.rotate = null;
            if (cb) { cb(); }
        })
        .start();

    // enable dirty flags and update object rotation y
    if (hasPhysics) {
        //obj.__dirtyRotation = true;
        //obj.__dirtyPosition = true;

        obj.tweens.rotate.onUpdate(function () {
            obj.__dirtyRotation = true;
            obj.__dirtyPosition = true;
        })
    }

    return obj.tweens.rotate;
}