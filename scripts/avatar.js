var THREE = window.THREE;
var Physijs = window.Physijs;

var selectedAvatar;

/**
 * createAvatar creates physics avatar capsule/cylinder mesh and loads avatar model into it
 * @param num
 * @param colors
 * @param x
 * @param z
 * @returns {CapsuleMesh}
 */
function createAvatar(team, num, colors, x, z, rot) {
    // create capsule mesh
    var mesh = new Physijs.CapsuleMesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32), // (radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
        Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: colors[0], wireframe: true }),
            0.8, 0.5
        ),
        0
    );

    // create cube mesh
    /*var mesh = new Physijs.BoxMesh(
        new THREE.BoxGeometry(0.5, 0.8, 0.5),
        Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: colors[0], wireframe: true }),
            0.8, 0.5
        ),
        0
    );*/

    mesh.geometry.dynamic = false;

    mesh.name = 'avatar-' + num;
    mesh.position.x = 0.5 + x;
    mesh.position.y = 0.4; //-0.02;
    mesh.position.z = 0.5 + z;
    mesh.rotation.y = rot;

    //mesh.num = num;
    //mesh.team = team;

    mesh.tweens = {};
    scene.add(mesh);

    mesh.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity ) {

        //console.log(other_object);
        if (mesh === selectedAvatar && other_object.name === 'ball') {
            kickBall(mesh, linear_velocity, angular_velocity);
        }

    });

    // load the ball model
    loadAvatarModel(mesh, num, colors, function (model) {
        mesh.model = model;
        mesh.visible = false;
    });

    // create avatar label
    var label = textSprite(num, {});
    label.position.y += 0.65;
    mesh.add(label);

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
 * @param avatar)
 */
function selectAvatar(avatar) {
    selectedAvatar = avatar;
    selectedAvatar.force = 0;

    moveCameraTo(avatar.position, 0, 25);
}


/**
 * moveAvatarTo tweens avatar and camera to given point
 * @param avatar
 * @param point
 @param speed
 */
function moveAvatarTo(avatar, point, speed) {
    // escape if position hasn't changed
    if (point.x === avatar.position.x && point.z === avatar.position.z) { return; }

    var delay = 100;

    moveObjectTo(avatar, point, delay, speed, true,
        function () {
            ballSelector.visible = false;
        }
    );

    /*avatar.tweens.move.onUpdate(function () {
       var vec = toXYCoords(avatar.position);
       avatar.label.style.transform = 'translate( ' + vec.x + 'px, ' + vec.y + 'px)';
    });*/

    moveCameraTo(point, delay, speed);
}


/**
 * rotateAvatarTo tweens avatar rotation to face given point
 * @param avatar
 * @param point
 @param speed
 */
function rotateAvatarTo(avatar, point, speed) {
    // TODO: Implement smarter mathematical way to tween rotations, maybe using Quaternions (?)

    // TODO: One thing we can try is to create a target dummy for each avatar,
    // TODO: then tween the target position and make the avatar lookAt the target onUpdate.
    // TODO: target position should be always infront of the avatar final point

    var oldAngle = avatar.rotation.clone();
    avatar.lookAt(point);
    var newAngle = avatar.rotation.clone();

    //avatar.rotation.x = oldAngle.x;
    avatar.rotation.y = oldAngle.y;
    //avatar.rotation.z = oldAngle.z;

    rotateObjectTo(avatar, newAngle, 0, speed, true);
}

