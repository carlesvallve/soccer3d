


function createBall(cb) {
    // create hidden physics mesh
    var mesh = new Physijs.SphereMesh(
        new THREE.IcosahedronGeometry( 0.175, 1 ),
        Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
            0.8, 1.0
        ),
        0.15
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

    ball.applyCentralImpulse(force, offset);
}