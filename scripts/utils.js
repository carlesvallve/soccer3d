function moveObjectTo(obj, point, delay, time, hasPhysics) {

    // multiply time per distance
    time *= obj.position.distanceTo(point);

    // stop previous move tween
    if (obj.tweens.move) { obj.tweens.move.stop(); }

    // tween object
    obj.tweens.move = new TWEEN.Tween(obj.position)
        .to(point, time).delay(delay)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () { obj.tweens.move = null; })
        .start();

    // enable dirty flags
    if (hasPhysics) {
        obj.tweens.move.onUpdate(function () {
            obj.__dirtyRotation = true;
            obj.__dirtyPosition = true;
        })
    }
}


function rotateObjectTo(obj, angle, delay, time, hasPhysics) {
    // stop previous tween
    if (obj.tweens.rotate) { obj.tweens.rotate.stop(); }

    // get from/to angles
    var angleFrom = { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z };
    var angleTo = { x: angle.x, y: angle.y, z: angle.z };

    // tween object
    obj.tweens.rotate = new TWEEN.Tween(angleFrom)
        .to(angleTo, time).delay(delay)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () { obj.tweens.rotate = null; })
        .start();

    // enable dirty flags and update object rotation y
    if (hasPhysics) {
        obj.tweens.rotate.onUpdate(function () {
            obj.__dirtyRotation = true;
            obj.__dirtyPosition = true;

            //obj.rotation.x = angleFrom.x;
            obj.rotation.y = angleFrom.y;
            //obj.rotation.z = angleFrom.z;
        })
    }
}