var THREE = window.THREE;

// Picking stuff

var projector = new THREE.Projector();
var mouseVector = new THREE.Vector3();

var mouseMoved = false;

window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mouseup', onMouseUp, false );

function onMouseDown( e ) { mouseMoved = false; }

function onMouseMove( e ) { mouseMoved = true; }

function onMouseUp( e ) {
    if (mouseMoved) { return; }

    scene.updateMatrixWorld();

    mouseVector.x = 2 * (e.clientX / SCREEN_WIDTH) - 1;
    mouseVector.y = 1 - 2 * ( e.clientY / SCREEN_HEIGHT );

    var raycaster = projector.pickingRay( mouseVector.clone(), camera );
    var intersects = raycaster.intersectObjects( scene.children );

    for( var i = 0; i < intersects.length; i++ ) {
        var intersection = intersects[ i ];
        var obj = intersection.object;

        // escape if not interactive objects
        if (!obj.name) { continue }
        if (obj.name === 'grid' || obj.name === 'sky') { continue; }

        //console.log(obj.name);

        // we selected the ball
        if (obj.name === 'ball') {
            //console.log(intersection.face, intersection.point.x, intersection.point.y, intersection.point.z);
            pushBall(intersection.point);
            return;
        }

        // we selected an avatar
        if (obj.name.split('-')[0] === 'avatar') {
            selectCell(intersection.point, obj);
            return;
        }

        // we selected the pitch
        if (obj.name === 'pitch') {
            selectCell(intersection.point);
            return;
        }
    }
}


function selectCell(point, avatar) {
    // escape if we didnt click on the top-face of the cube
    if (point.y < -0.01) { return; }

    // get cell coords
    var x = Math.floor(point.x); //  + gridW / 2
    var y = Math.floor(point.z); //  + gridH / 2

    //console.log('selectCell(' + x + ',' + y +')');

    // check for avatar selection
    if (avatar) {
        selectAvatar(avatar);
    } else {
        // check if the cell is ocuppied by an avatar and i so, select it
        scene.traverse(function(e) {
            if (e.name.split('-')[0] === 'avatar' ) {
                if (Math.floor(e.position.x) === x && Math.floor(e.position.z) === y) {
                    selectAvatar(e);
                    return;
                }
            }
        });
    }

    // escape if no avatar is selected
    if (!selectedAvatar) { return; }

    // record goal 3d point
    moveAvatar(selectedAvatar, new THREE.Vector3( x + 0.5, selectedAvatar.position.y, y + 0.5));
}


function selectAvatar(avatar) {
    selectedAvatar = avatar;

    // move camera to avatar

    /*var point = new THREE.Vector3(avatar.position.x, cameraTarget.position.y, avatar.position.z);
    var dist = cameraTarget.position.distanceTo(point);

    cameraTarget.tweens.move = new TWEEN.Tween(cameraTarget.position).to(point, 100 * dist)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .start()*/


    // move ball to avatar

    /*point = new THREE.Vector3(avatar.position.x, ball.position.y, avatar.position.z);

    //ball.geometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ) );
    ball.lookAt(point);

    dist = ball.position.distanceTo(point);

    ball.tweens.move = new TWEEN.Tween(ball.position).to(point, 100 * dist)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .onUpdate(function () { ball.rotation.x += 0.1; })
        .start()*/

}


function createArrowHelper() {
    // create movement arrow
    /*var dir = new THREE.Vector3( x + 0.5 - selectedAvatar.position.x , 0, y + 0.5 - selectedAvatar.position.z );
     var origin = new THREE.Vector3( selectedAvatar.position.x, 0.005, selectedAvatar.position.z );
     var length = origin.distanceTo(new THREE.Vector3(x + 0.5, 0.005, y + 0.5));
     var color = 0xff9900; // Math.floor(Math.random() * 16777215);
     var arrowHelper = new THREE.ArrowHelper( dir, origin, length, color, 0.1, 0.1 );
     grid.add( arrowHelper );*/
}




