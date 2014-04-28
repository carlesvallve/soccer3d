var THREE = window.THREE;
var Physijs = window.Physijs;

var ballIsOut = false;

function createBall() {
    // create hidden physics mesh
    var mesh = new Physijs.SphereMesh(
        new THREE.IcosahedronGeometry( 0.175, 1 ),
        Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
            0.8, 0.9
        ),
        0.5
    );

    mesh.geometry.dynamic = false;

    mesh.name = 'ball';
    mesh.position.x = gridW / 2;
    mesh.position.y = 0.175;
    mesh.position.z = gridH / 2;

    mesh.tweens = {};
    scene.add(mesh);

    // load the ball model
    loadBallModel(mesh, function (model) {
        mesh.model = model;
        mesh.visible = false;
    });

    return mesh;
}


function loadBallModel(parent, cb) {
    var loader = new THREE.JSONLoader();
    loader.load( 'assets/models/soccer-ball.js', function (geometry, materials) {
        var scale = 0.055;

        // create avatar mesh
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
        mesh.name = 'ball';
        mesh.scale.set(scale, scale, scale);

        mesh.castShadow = true;
        //avatar.receiveShadow = true;

        mesh.tweens = {};
        parent.add(mesh);

        // return callback
        if (cb) { cb(mesh); }
    });
}


function kickBall(avatar, linear_velocity, angular_velocity) {
    var force = selectedAvatar.force * 0.5; // * 0.5; //7.5;

    // get direction vector
    var dir = new THREE.Vector3(
        ball.position.x - avatar.position.x,
        0, //-0.5,
        ball.position.z - avatar.position.z
    ).normalize();

    /*var point = dir.clone();
        point.y = 16;*/

    // get direction vector length
    //dir.multiplyScalar(force);

    // apply kick impulse
    //ball.applyCentralImpulse(dir);
    ball.applyImpulse(dir.multiplyScalar(force), dir);

    //console.log('kickBall', dir.x, dir.y, dir.z);
}


function pushBall(point) {
    ball.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    //ball.setAngularVelocity(new THREE.Vector3(0, 0, 0));

    // TODO: find a way to find the force vector depending on how we slide from what camera angle

    var force = new THREE.Vector3(
        (-point.x + ball.position.x) * gui.params.force,
        (-point.y + ball.position.y) * gui.params.force,
        (-point.z + ball.position.z) * gui.params.force
    );

    var offset = new THREE.Vector3(-point.x, -point.y, -point.z);

    ball.applyImpulse(force, offset);
}


function checkForBallLimits() {
    if (ballIsOut) { return; }

    if (ball.position.x < 1.9 || ball.position.z < 1.9 || ball.position.x > gridW - 1.9 || ball.position.z > gridH - 1.9) {
        console.log('OUT!');
        ballIsOut = true;

        // selectedAvatar = null;

        var tween;
        if (ball.position.x < 2 || ball.position.x > gridW - 2) { tween = sideThrow(); }
        if (ball.position.z < 2 || ball.position.z > gridH - 2) { tween = goalKick(); }

        tween.onStart(function () {
            ball.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            ball.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            scene.simulate();
        });

        tween.onComplete(function () {
            ballIsOut = false;
        });
    }
}


function sideThrow() {
    // get side-throw point
    var point;
    if (ball.position.x < 2) { point = new THREE.Vector3(2, 0.175, Math.round(ball.position.z)); }
    if (ball.position.x > gridW - 2) { point = new THREE.Vector3(gridW - 2, 0.175, Math.round(ball.position.z)); }

    // locate ball at side-throw point
    var tween = moveObjectTo(ball, point, 1000, 0, true);

    return tween;
}


function goalKick() {
    // get goal-kick point
    var point;
    if (ball.position.z < 2) { point = new THREE.Vector3(gridW / 2, 0.175, 4); }
    if (ball.position.z > gridH - 2) { point = new THREE.Vector3(gridW / 2, 0.175, gridH - 4); }

    // locate ball at goal-kick point
    var tween = moveObjectTo(ball, point, 1000, 0, true);

    return tween;
}