function loadBall(parent, cb) {
    var loader = new THREE.JSONLoader();
    loader.load( 'assets/models/soccer-ball.js', function (geometry, materials) {
        var scale = 0.055;

        // create avatar mesh
        //var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));

        var mesh = new Physijs.SphereMesh( geometry, new THREE.MeshFaceMaterial( materials ), 0.8, { restitution: 0.4 });
        mesh.name = 'ball';

        mesh.scale.set(scale, scale, scale);
        mesh._physijs.radius *= scale; // TODO: Seems like a bug in physijs to have to set this manually...
        mesh.position.x = gridW / 2;
        mesh.position.y = 10.16;
        mesh.position.z = gridH / 2;
        //mesh.rotation.y = Math.random() * Math.PI;

        mesh.castShadow = true;
        //avatar.receiveShadow = true;

        mesh.tweens = {};
        parent.add(mesh);

        //mesh.add(new THREE.AxisHelper(6));

        // return callback
        if (cb) { cb(mesh); }
    });
}