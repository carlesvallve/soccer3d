function createMultiMaterialCube() {
    var materials = [
        new THREE.MeshLambertMaterial( { opacity:0.6,
            color: Math.random() * 0xffffff,
            transparent:true } ),
        new THREE.MeshBasicMaterial( { color: 0x000000,
            wireframe: true } )
    ];

    var cubeSize = Math.ceil((Math.random() * 3));
    var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    var cube = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    cube.children.forEach(function(e) { e.castShadow=true });

    cube.name = "cube-" + scene.children.length;
    cube.position.x=-30 + Math.round((Math.random() * plane.geometry.width));
    cube.position.y= Math.round((Math.random() * 5));
    cube.position.z=-20 + Math.round((Math.random() * plane.geometry.height));
    scene.add(cube);
}


function createCube() {
    var cubeSize = 0.2 + Math.random() * 0.8; // Math.ceil((Math.random() * 3));
    var cubeHeight = cubeSize + Math.random() * 2;

    var geometry = new THREE.BoxGeometry(cubeSize, cubeHeight, cubeSize);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff });
    var cube = new THREE.Mesh(geometry, cubeMaterial);

    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.name = "cube-" + scene.children.length;
    cube.position.x = 0.5 + Math.floor((Math.random() * gridW)); // randomInt(0, gridW - 1); //(0.5 - cubeSize / 2);// + Math.round((Math.random() * gridW)); // plane.geometry.width
    cube.position.y = cubeHeight * 0.5; // Math.round((Math.random() * 3));
    cube.position.z = 0.5 + Math.floor((Math.random() * gridH)); // + randomInt(0, gridH - 1); //(0.5 - cubeSize / 2); //Math.round((Math.random() * gridH)); // plane.geometry.height
    grid.add(cube);
}


function createSphere() {
    var sphereGeometry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);
}


function deleteObject() {
    var allChildren = grid.children;
    var lastObject = allChildren[allChildren.length-1];
    if (lastObject instanceof THREE.Mesh) {
        grid.remove(lastObject);
    }
}