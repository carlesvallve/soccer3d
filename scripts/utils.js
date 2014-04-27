function moveObjectTo(obj, point, speed, removePhysics) {

    //var point = new THREE.Vector3(pos.x, cameraTarget.position.y, pos.z);
    var dist = obj.position.distanceTo(point);

    if (obj.tweens.move) { obj.tweens.move.stop(); }

    obj.tweens.move = new TWEEN.Tween(obj.position)
        .to(point, dist * speed)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () { obj.tweens.move = null; })
        .start();

    if (removePhysics) {
        obj.__dirtyRotation = true;
        obj.__dirtyPosition = true;

        obj.tweens.move.onUpdate(function () {
            obj.__dirtyRotation = true;
            obj.__dirtyPosition = true;
        })
    }
}