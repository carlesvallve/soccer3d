var THREE = window.THREE;

function createAmbientLight(color, intensity) {
    // ambientLight
    var light = new THREE.AmbientLight(color);
    light.intensity = intensity;

    scene.add(light);
    return light;
}


function createHemiLight(parent, pos, color1, color2, intensity) {
    var light = new THREE.HemisphereLight( color1, color2, intensity );
    light.position = pos; //.set( 0, 50, 0 );
    parent.add(light);
}


function createDirectionalLight(parent, pos, color, intensity) {
    var light = new THREE.DirectionalLight(color);
    light.intensity = intensity;
    light.position = pos; //.set(0, 10, 0);
    light.target.position.set(0, 0, 0); // = pos; //.set(gridW * 0.5, 0, gridH * 0.5);
    light.castShadow = true;
    light.shadowDarkness = 0.8;
    light.shadowCameraVisible = true; // only for debugging
    // these six values define the boundaries of the yellow box seen above
    light.shadowCameraNear = 2;
    light.shadowCameraFar = 50;
    light.shadowCameraLeft = -10;
    light.shadowCameraRight = 10;
    light.shadowCameraTop = 10;
    light.shadowCameraBottom = -10;
    parent.add(light);

    return light;
}


function createSpotLight(parent, pos, color, intensity) {
    var spotLight = new THREE.SpotLight(color);
    spotLight.intensity = intensity;
    spotLight.position = pos;
    spotLight.target.position.set(0, 0, 0);

    spotLight.shadowDarkness = 0.8;

    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 1;
    spotLight.shadowCameraFar = 100;
    spotLight.shadowCameraFov = 100;

    //spotLight.shadowCameraVisible = true;

    spotLight.shadowMapWidth = spotLight.shadowMapHeight = 1024 * 2;

    parent.add( spotLight );

    return spotLight;
}