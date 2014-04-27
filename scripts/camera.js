var camera, cameraTarget;

function createCamera(parent) {
    // create camera target
    cameraTarget = new THREE.Object3D();
    cameraTarget.name = 'cameraTarget';
    cameraTarget.position.set(gridW / 2, 1, gridH / 2);
    cameraTarget.tweens = {};
    parent.add(cameraTarget);

    // locate camera
    camera = new THREE.PerspectiveCamera(45, (SCREEN_WIDTH) / (SCREEN_HEIGHT), 0.1, 1000);
    camera.fov = 30;
    camera.position.set(0, 40, gridW / 1.5);

    // link camera to camera target
    cameraTarget.add(camera);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
}


function moveCameraTo(point, speed) {
    point = new THREE.Vector3(point.x, cameraTarget.y, point.z);
    moveObjectTo(cameraTarget, point, speed, false);
}






