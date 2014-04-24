
var THREE = window.THREE;

var Detector = window.Detector;
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

var SCREEN_WIDTH = window.innerWidth - 10;
var SCREEN_HEIGHT = window.innerHeight - 10;

var scene, camera, renderer, gui, controls, stats;
var numberOfObjects;


function initApp() {
    createScene();

    createGui();
    createStats();
    createControls();
    createRenderer();

    render();
}


function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = false;
    document.body.appendChild(renderer.domElement);
}


function update() {
    controls.update();
    stats.update();

    if (selectedAvatar) {
        selector.position.x = selectedAvatar.position.x;
        selector.position.z = selectedAvatar.position.z;
        selector.rotation.z += 0.03;
    }


}

function render() {
    update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    TWEEN.update();
}


function createGui() {
    gui = new dat.GUI();

    var initialNumberObObjects = grid.children.length;

    gui.params = new function() {
        this.rotationSpeed = 0;
        this.bouncingSpeed = 0;
        this.numberOfObjects = grid.children.length - initialNumberObObjects;

        this.addCube = function() {
            //createCube();
            loadAvatar();
            this.numberOfObjects = grid.children.length - initialNumberObObjects;
        };

        this.removeCube = function() {
            deleteObject();
            this.numberOfObjects = grid.children.length - initialNumberObObjects;
        };

        this.outputObjects = function() {
            console.log(scene.children);
        };
    };

    gui.add(gui.params, 'rotationSpeed', 0, 0.5);
    gui.add(gui.params, 'bouncingSpeed', 0, 0.5);
    gui.add(gui.params, 'addCube');
    gui.add(gui.params, 'removeCube');
    gui.add(gui.params, 'outputObjects');
    gui.add(gui.params, 'numberOfObjects').listen();
}


function createControls() {
    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    //controls.addEventListener( 'change', render );
}


function createStats() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

