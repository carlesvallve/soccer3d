var THREE = window.THREE;

var selectedAvatar;

/**
 * createAvatar creates physics avatar capsule/cylinder mesh and loads avatar model into it
 * @param num
 * @param colors
 * @param x
 * @param z
 * @returns {CapsuleMesh}
 */
function createAvatar(num, colors, x, z) {
    /*var mesh = new Physijs.SphereMesh(
        new THREE.IcosahedronGeometry( 0.3, 1 ),
        Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: colors[0], wireframe: true })
            //,0.8, 1.0
        ),
        1
    );*/

    // create hidden physics capsule mesh
    var mesh = new Physijs.CapsuleMesh(
        //CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
        new THREE.CylinderGeometry(0.3, 0.3, 0.8), //, 8, 1, false),
        Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: colors[0], wireframe: true }),
            0.8, 0.5
        ),
        0
    );

    mesh.geometry.dynamic = false;

    mesh.name = 'avatar-' + num;
    mesh.position.x = 0.5 + x;
    mesh.position.y = 0.4; //-0.02;
    mesh.position.z = 0.5 + z;

    mesh.tweens = {};
    scene.add(mesh);

    // load the ball model
    loadAvatarModel(mesh, num, colors, function (model) {
        mesh.model = model;
        //mesh.visible = false;
    });

    return mesh;
}


/**
 * loadAvatarModel loads avatar animated three.js model and returns the mesh when loaded
 * @param parent
 * @param num
 * @param colors
 * @param cb
 */
function loadAvatarModel(parent, num, colors, cb) {
    var loader = new THREE.JSONLoader();
    loader.load( 'assets/models/android-animations.json', function (geometry, materials) {
        var size = 0.065; // + Math.random() * 0.02;

        // set avatar colors

        var color1 = new THREE.Color(colors[0]);
        var color2 = new THREE.Color(colors[1]);
        var skinColor = color2 || new THREE.Color(0xcc9966);

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
        mesh.name = 'avatarModel-' + num;

        mesh.scale.set(size, size * 1.25, size);
        mesh.position.y = - 0.5;

        mesh.castShadow = true;
        //mesh.receiveShadow = true;

        mesh.tweens = {};
        parent.add(mesh);

        // return callback
        if (cb) { cb(mesh); }
    });
}


/*function animate(skinnedMesh) {
    var materials = skinnedMesh.material.materials;

    for (var i in materials) {
        materials[i].skinning = true;
    }

    THREE.AnimationHandler.add(skinnedMesh.geometry.animation);
    var animation = new THREE.Animation(skinnedMesh, "morphTargets", THREE.AnimationHandler.CATMULLROM);
    animation.play();
}*/


/**
 * selectAvatar records given avatar object and tweens camera to it
 * @param avatar
 */
function selectAvatar(avatar) {
    selectedAvatar = avatar;

    moveCameraTo(avatar.position);
}


/**
 * moveAvatar tweens avatar and camera to given point
 * @param avatar
 * @param point
 */
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
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () { avatar.tweens.move = null; })
        .start();

    // move camera target to point
    if (cameraTarget.tweens.move) { cameraTarget.tweens.move.stop(); }

    cameraTarget.tweens.move = new TWEEN.Tween(cameraTarget.position)
        .to(new THREE.Vector3(point.x, cameraTarget.position.y, point.z), time)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onComplete(function () { cameraTarget.tweens.move = null; })
        .start();
}

