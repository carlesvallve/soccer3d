function moveObjectTo(obj, point, delay, time, hasPhysics, cb) {
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
            if (cb) { cb(); }
        })
        .start();

    // enable dirty flags
    if (hasPhysics) {
        obj.__dirtyRotation = true;
        obj.__dirtyPosition = true;

        obj.tweens.move.onUpdate(function () {
            obj.__dirtyRotation = true;
            obj.__dirtyPosition = true;
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