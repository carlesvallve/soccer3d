var camera, cameraTarget;

function createCamera() {
    // create camera target
    cameraTarget = new THREE.Object3D();
    cameraTarget.name = 'cameraTarget';
    cameraTarget.position.set(gridW / 2, 2, gridH / 2);
    cameraTarget.tweens = {};
    grid.add(cameraTarget);

    // locate camera
    camera = new THREE.PerspectiveCamera(45, (SCREEN_WIDTH) / (SCREEN_HEIGHT), 0.1, 1000);
    camera.fov = 30;
    camera.position.set(0, 30, 0);

    // link camera to camera target
    cameraTarget.add(camera);
}


