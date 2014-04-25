var THREE = window.THREE;
//var gridW = 17, gridH = 21, tileSize = 1;
var gridW = 35, gridH = 44, tileSize = 1;
var grid, selector, ball;
var debugEnabled = true;


function createScene() {
    // create scene
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
    // scene = new THREE.Scene();


    // create skybox
    createSkyBox();

    // create grid
    createGrid();

    // create goals
    //loadGoal('top');
    //loadGoal('bottom');

    // create lights
    createHemiLight(grid, new THREE.Vector3(gridW, 60, gridH), 0x666666, 0xffffff, 0.6);
    createSpotLight(grid, new THREE.Vector3(gridW * 1.5, 40, gridH * 1.5), 0xffffff, 1.5);

    // create camera
    createCamera();

    // debug
    if (debugEnabled) {
        scene.add(new THREE.AxisHelper(1));
        grid.add(new THREE.AxisHelper(1));
        //cameraTarget.add(new THREE.AxisHelper(1));
    }
}


function createSkyBox() {
    var bgColor = 0x222222;
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var material = new THREE.MeshBasicMaterial( { color: bgColor, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( geometry, material );
    skyBox.name = 'skyBox';
    scene.add(skyBox);

    scene.fog = new THREE.FogExp2( bgColor, 0.005 );
}


function createGrid() {
    grid = new THREE.Object3D();
    grid.name = 'grid';
    grid.position.set(-gridW/2, 0, -gridH/2);


    var cube = createCube(grid);
    var plane = createPlane(grid);
    createGridHelper(grid);

    //grid.rotation.x += Math.PI / 10;
    //plane.rotation.x += Math.PI / 10;
    //cube.rotation.x += Math.PI / 11;

    selector = createSelector();

    loadBall(function (mesh) {
        ball = mesh;

        requestAnimationFrame(render);
    });

    team1 = createTeam(1, 'top', getRandomFormation(), [0xff0000, 0xffffff]);
    team2 = createTeam(2, 'bottom', getRandomFormation(), [0x000000, 0x777777]);

    scene.add(grid);
}


function createGridHelper(grid) {
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
    var gridHelper = new THREE.Line( geometry, material );
    gridHelper.name = 'gridHelper';
    gridHelper.type = THREE.LinePieces;
    gridHelper.position.set(0, 0.01, 0);

    grid.add(gridHelper);
}


function createCube(grid) {
    var geometry = new THREE.BoxGeometry(gridW, 0.5, gridH);
    var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x999900 }),
        .8, // high friction
        .4 // low restitution
    );
    //var cube = new THREE.Mesh(geometry, material);
    var cube = new Physijs.BoxMesh(geometry, material, 0);
    cube.name = 'gridCube';
    cube.position.set(gridW/2, -0.26, gridH/2);
    grid.add(cube);

    return cube;
}

function createPlane(grid) {
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
    var plane = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    plane.name = 'plane';
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(gridW/2, 0, gridH/2);
    plane.children[0].receiveShadow = true;

    grid.add(plane);

    return plane;
}


function createFaceMaterialPlane(grid) {
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
    grid.add( mesh );

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





function loadGoal(field) {
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

        grid.add( mesh );

    });

    loader.load( 'assets/models/FootballGoal.stl'); //, function (event) {

        //console.log('>>>', event);
    //});

}






