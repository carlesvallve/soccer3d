var THREE = window.THREE;
var Physijs = window.Physijs;

function createPitch() {
    // create pitch
    pitch = {
        cube: createCube(),
        plane: createPlane(),
        grid: createGrid(),
        walls: createWalls()
    };

    // create selector
    selector = createSelector();

    // create ball
    ball = createBall();
    //loadBall(scene, function (mesh) { ball = mesh; });

    // create teams
    team1 = createTeam(1, 'top', getRandomFormation(), [0xff0000, 0xffffff]);
    team2 = createTeam(2, 'bottom', getRandomFormation(), [0x000000, 0x777777]);

    // create goals
    //loadGoal('top');
    //loadGoal('bottom');
}



function createCube() {
    var geometry = new THREE.BoxGeometry(gridW, 0.5, gridH);
    var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x996600 }), 1.0, 0.8);

    var mesh = new Physijs.BoxMesh(geometry, material, 0);
    mesh.geometry.dynamic = false;

    mesh.name = 'pitch';
    mesh.position.set(gridW/2, -0.26, gridH/2);

    scene.add(mesh);
    return mesh;
}


function createPlane() {
    // geometry
    var geometry = new THREE.PlaneGeometry(gridW, gridH, gridW, gridH);

    // textures
    var texture1 = new THREE.ImageUtils.loadTexture( 'assets/textures/soccer02.png');
    var texture2 = new THREE.ImageUtils.loadTexture( 'assets/textures/grass1.jpg');
    texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(5, 5); //texture.repeat.set(gridW * 0.5, gridH * 0.5);

    // materials
    var materials = [
        new THREE.MeshLambertMaterial({ map: texture1, opacity: 0.5, transparent: true }),
        new THREE.MeshLambertMaterial({ map: texture2, side: THREE.DoubleSide }) //
    ];

    // plane
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    mesh.name = 'plane';
    mesh.rotation.x = -0.5 * Math.PI;
    mesh.position.set(gridW/2, 0, gridH/2);
    mesh.children[0].receiveShadow = true;

    scene.add(mesh);
    return mesh;
}


function createGrid() {
    var geometry = new THREE.Geometry();
    var d = 0; // tileSize * 0.5;

    // horizontal line vertices
    for ( var y = 0; y <= gridH; y += 1 ) {
        geometry.vertices.push(new THREE.Vector3(-d , 0, -d +y * tileSize));
        geometry.vertices.push(new THREE.Vector3(-d + gridW * tileSize, 0, -d + y * tileSize));
    }

    // vertical line vertices
    for ( var x = 0; x <= gridW; x += 1 ) {
        geometry.vertices.push(new THREE.Vector3(-d + x * tileSize, 0, -d));
        geometry.vertices.push(new THREE.Vector3(-d + x * tileSize, 0, -d + gridH * tileSize));
    }

    // line material
    var material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });

    // grid
    var mesh = new THREE.Line( geometry, material );
    mesh.name = 'grid';
    mesh.type = THREE.LinePieces;
    mesh.position.set(0, 0.01, 0);

    scene.add(mesh);
    return mesh;
}


function createWalls() {
    // north
    var mesh_n = new Physijs.BoxMesh(
        new THREE.BoxGeometry(gridW, 1.5, 0.1),
        Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x996600 }), 0.8, 1.0),
        0
    );
    mesh_n.position.set(gridW/2, 0.25, 0);
    scene.add(mesh_n);

    // south
    var mesh_s = new Physijs.BoxMesh(
        new THREE.BoxGeometry(gridW, 1.5, 0.1),
        Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x996600 }), 0.8, 1.0),
        0
    );
    mesh_s.position.set(gridW/2, 0.25, gridH);
    scene.add(mesh_s);

    // east
    var mesh_e = new Physijs.BoxMesh(
        new THREE.BoxGeometry(0.1, 1.5, gridH),
        Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x996600 }), 0.8, 1.0),
        0
    );
    mesh_e.position.set(0, 0.25, gridH/2);
    scene.add(mesh_e);

    // west
    var mesh_w = new Physijs.BoxMesh(
        new THREE.BoxGeometry(0.1, 1.5, gridH),
        Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x996600 }), 0.8, 1.0),
        0
    );
    mesh_w.position.set(gridW, 0.25, gridH/2);
    scene.add(mesh_w);

    // return walls object
    return { n: mesh_n, s: mesh_s, e: mesh_e, w: mesh_w }
}


function createGoal() {
    // TODO: Create a physics composed object...
}


function createSelector() {
    var geometry = new THREE.PlaneGeometry(2.0, 2.0, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        map: new THREE.ImageUtils.loadTexture( 'assets/textures/particles/particle4u.png'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.75,
        depthWrite: false
        //depthTest: false
    });

    var selector = new THREE.Mesh(geometry, material);
    selector.name = 'selector';
    selector.rotation.x = -0.5 * Math.PI;
    selector.position.set(gridW/2, 0.001, gridH/2);

    scene.add(selector);

    return selector;
}


// ************************************************************************
// ************************************************************************

function createFaceMaterialPlane(parent) {
    // geometry
    var geometry = new THREE.PlaneGeometry( gridW, gridH, gridW, gridH ); //500, 500, 10, 10 );

    // materials
    var materials = [
        new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0.5 }),
        new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.5}),
        new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 0.5 })
    ];

    // mesh
    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
    mesh.rotation.x = -0.5 * Math.PI;
    mesh.position.set(gridW/2, 0, gridH/2);
    mesh.receiveShadow = true;
    parent.add( mesh );

    // paint cells
    for (var y = 0; y < gridH; y++) {
        for (var x = 0; x < gridW; x++) {
            // paint the cell with a random material index
            var materialIndex = ~~(Math.random() * 3);
            var index = (x * 2) + (gridW * y * 2);
            mesh.geometry.faces[ index ].materialIndex = materialIndex;
            mesh.geometry.faces[ index + 1 ].materialIndex = materialIndex;
        }
    }
}


function loadGoal(parent, field) {
    // TODO: Gives an error after pulling latest Three.js
    return;

    var loader = new THREE.STLLoader();

    loader.addEventListener('load', function (event) {

        //console.log('>>>', event);

        var geometry = event.content;
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        var mesh = new THREE.Mesh( geometry, material );

        mesh.name = "goal-" + field;
        mesh.scale.set( 0.0017, 0.0022, 0.0028 );

        if (field === 'top') {
            mesh.position.set( gridW / 2, 0, 1 );
            mesh.rotation.set( 0, 0, 0 );
        } else {
            mesh.position.set( gridW / 2, 0, gridH - 1 );
            mesh.rotation.set( 0, Math.PI, 0 );
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        parent.add( mesh );

    });

    loader.load( 'assets/models/FootballGoal.stl'); //, function (event) {

        //console.log('>>>', event);
    //});

}

