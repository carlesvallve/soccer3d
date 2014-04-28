var THREE = window.THREE;
var Physijs = window.Physijs;

var Detector = window.Detector;
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

Physijs.scripts.worker = '/soccer3d/lib/physijs/physijs_worker.js';
Physijs.scripts.ammo = '/soccer3d/lib/physijs/ammo.js';

var SCREEN_WIDTH = window.innerWidth - 10;
var SCREEN_HEIGHT = window.innerHeight - 10;

var renderer, controls, stats, gui;
var scene, camera, pitch, ball, selector;
var gridW = 35, gridH = 44, tileSize = 1;


function initApp() {
    createScene();
    createPitch();

    createControls();
    createStats();
    createGui();

    createRenderer();

    requestAnimationFrame(render);
}


function createScene() {
    // create scene
    scene = new Physijs.Scene(); // { fixedTimeStep: 1 / 120 }
    scene.add(new THREE.AxisHelper(1));
    scene.setGravity(new THREE.Vector3( 0, -20, 0 ));

    // create camera
    createCamera(scene);

    // create lights
    createHemiLight(scene, new THREE.Vector3(gridW / 2, 60, gridH / 2), 0x666666, 0xffffff, 0.5);
    createSpotLight(scene, new THREE.Vector3(gridW * 1.25, 40, gridH * 1.25), 0xffffff, 1.6);

    // create skybox
    createSkyBox();

    // create hud
    createHud();
}


function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = false;
    document.body.appendChild(renderer.domElement);
}


function render() {
    // update libs
    controls.update();
    stats.update();
    TWEEN.update();

    // update ball
    // TODO: Friction should take care of this (?)
    ball.setAngularVelocity(ball.getAngularVelocity().multiplyScalar(0.9));
    checkForBallLimits();

    // select nearest avatar to ball
    selectNearestAvatarToBall();

    // increase force during mouse-down
    if (mouseIsDown && selectedAvatar) {
        selectedAvatar.force += 1;
        hud.force.innerText = 'Force ' + selectedAvatar.force;
    }

    // update selected avatar
    if (selectedAvatar) {
        selector.position.x = selectedAvatar.position.x;
        selector.position.z = selectedAvatar.position.z;
        selector.rotation.z += 0.03;
    }

    // update camera
    cameraTarget.position.x = ball.position.x;
    cameraTarget.position.z = ball.position.z;

    // update physics
    scene.simulate(undefined, 1); // { timeStep: timeStep, maxSubSteps: maxSubSteps }

    // render
    renderer.render(scene, camera);

    // request next frame
    requestAnimationFrame(render);




}


function createControls() {
    controls = new THREE.OrbitControls(camera);

    controls.rotateSpeed = 1.5;
    controls.zoomSpeed = 1.5;
    controls.panSpeed = 1.5;

    controls.minDistance = 4;
    controls.maxDistance = 60;

    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI / 2; // radians

    //controls.addEventListener( 'change', function () { console.log('changing'); });
}


function createStats() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}


function createGui() {
    gui = new dat.GUI();
    gui.close();

    gui.params = new function() {
        this.force = 50.0;

        this.outputObjects = function() {
            console.log(scene.children);
        };
    };

    gui.add(gui.params, 'outputObjects');
    gui.add(gui.params, 'force', 0.0, 100.0);
}

