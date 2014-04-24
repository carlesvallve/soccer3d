var THREE = window.THREE;

var selectedAvatar;


function loadAvatar() {
    var loader = new THREE.JSONLoader();
    loader.load( 'assets/models/android-animations.json', function (geometry, materials) {
        var size = 0.03 + + Math.random() * 0.01; //0.05 + Math.random() * 0.05;

        var material = new THREE.MeshFaceMaterial( materials );

        var avatar = new THREE.Mesh( geometry, material );
        avatar.name = "avatar-" + grid.children.length;

        avatar.castShadow = true;
        avatar.overdraw = true;
        //avatar.receiveShadow = true;

        avatar.scale.set(size, size, size);
        avatar.position.x = 0.5 + Math.floor((Math.random() * gridW));
        avatar.position.y = -0.02;
        avatar.position.z = 0.5 + Math.floor((Math.random() * gridH));

        avatar.rotation.y = Math.random() * Math.PI;
        grid.add(avatar);

        //createSelector(avatar.position);
    }); // , addAvatar
}


function animate(skinnedMesh) {
    var materials = skinnedMesh.material.materials;

    for (var i in materials) {
        materials[i].skinning = true;
    }

    THREE.AnimationHandler.add(skinnedMesh.geometry.animation);
    var animation = new THREE.Animation(skinnedMesh, "morphTargets", THREE.AnimationHandler.CATMULLROM);
    animation.play();
}


function createSelector() {
    var geometry = new THREE.PlaneGeometry(1.25, 1.25, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        map: new THREE.ImageUtils.loadTexture( 'assets/textures/particles/particle4u.png'),
        transparent: true,
        blending: THREE.AdditiveBlending, //THREE.SubstractiveBlending,
        opacity: 1,
        depthWrite: false
        //depthTest: false
    });

    var selector = new THREE.Mesh(geometry, material);
    selector.name = 'selector';
    selector.rotation.x = -0.5 * Math.PI;
    selector.position.set(gridW/2, 0.001, gridH/2);

    grid.add(selector);

    return selector;
}

