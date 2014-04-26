var bgColor = 0x222222;

function createSkyBox() {
    scene.fog = new THREE.FogExp2( bgColor, 0.005 );

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var material = new THREE.MeshBasicMaterial( { color: bgColor, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( geometry, material );
    skyBox.name = 'sky';
    skyBox.position.set(gridW / 2, 0 , gridH / 2);

    scene.add(skyBox);
    return skyBox;
}