var THREE = window.THREE;

var selectedAvatar;


function loadAvatar(num, colors, cb) {
    var loader = new THREE.JSONLoader();
    loader.load( 'assets/models/android-animations.json', function (geometry, materials) {
        var size = 0.065; // + Math.random() * 0.02;

        // set avatar colors

        var color1 = new THREE.Color(colors[0]);
        var color2 = new THREE.Color(colors[1]);
        var skinColor = color2; //new THREE.Color(0xcc9966);

        // paint body parts
        materials[1].color = skinColor; // head
        materials[4].color = skinColor; // antenna left
        materials[5].color = skinColor; // antenna right
        materials[9].color = color1; // body
        materials[0].color = color2; // arm right
        materials[6].color = color2; // arm left
        materials[7].color = color2; // leg right
        materials[8].color = color2; // leg left


        // create avatar mesh
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
        mesh.name = 'avatar-' + num ;//grid.children.length;

        mesh.scale.set(size, size, size);

        mesh.castShadow = true;
        //avatar.receiveShadow = true;

        mesh.tweens = {};
        grid.add(mesh);

        // return callback
        if (cb) { cb(num, mesh); }
    });
}


function animate(skinnedMesh) {
    var materials = skinnedMesh.material.materials;

    for (var i in materials) {
        materials[i].skinning = true;
    }

    THREE.AnimationHandler.add(skinnedMesh.geometry.animation);
    var animation = new THREE.Animation(skinnedMesh, "morphTargets", THREE.AnimationHandler.CATMULLROM);
    animation.play();
}


function createSelector(parent) {
    var geometry = new THREE.PlaneGeometry(2.5, 2.5, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        map: new THREE.ImageUtils.loadTexture( 'assets/textures/particles/particle4u.png'),
        transparent: true,
        blending: THREE.AdditiveBlending, //THREE.SubstractiveBlending,
        opacity: 0.75,
        depthWrite: false
        //depthTest: false
    });

    var selector = new THREE.Mesh(geometry, material);
    selector.name = 'selector';
    selector.rotation.x = -0.5 * Math.PI;
    selector.position.set(gridW/2, 0.001, gridH/2);

    parent.add(selector);

    return selector;
}


function moveAvatar(avatar, point) {
    // escape if position hasn't changed
    if (point.x === avatar.position.x && point.z === avatar.position.z) { return; }

    // look at point
    avatar.lookAt(point);

    // get time to point
    var dist = avatar.position.distanceTo(point);
    var time = 100 * dist;

    // move avatar to point
    if (avatar.tweens.move) { avatar.tweens.move.stop(); }

    avatar.tweens.move = new TWEEN.Tween(avatar.position)
        .to(point, time)
        //.easing(TWEEN.Easing.Exponential.Out)
        .onComplete(function () { avatar.tweens.move = null; })
        .start()

    // move camera target to point
    console.log('moveAvatar');
    if (cameraTarget.tweens.move) { cameraTarget.tweens.move.stop(); }

    cameraTarget.tweens.move = new TWEEN.Tween(cameraTarget.position)
        .to(new THREE.Vector3(point.x, cameraTarget.position.y, point.z), time * 1.0)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () { cameraTarget.tweens.move = null; })
        .start()


}

