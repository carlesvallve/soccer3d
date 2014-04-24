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
    if (!grid || mouseMoved) { return; }

    mouseVector.x = 2 * (e.clientX / SCREEN_WIDTH) - 1;
    mouseVector.y = 1 - 2 * ( e.clientY / SCREEN_HEIGHT );

    var raycaster = projector.pickingRay( mouseVector.clone(), camera );
    var intersects = raycaster.intersectObjects( grid.children );

    for( var i = 0; i < intersects.length; i++ ) {
        var intersection = intersects[ i ];
        var obj = intersection.object;

        // escape if not interactive objects
        if (!obj.name) { continue }
        if (obj.name === 'gridHelper') { continue; }

        // we selected an avatar
        if (obj.name.split('-')[0] === 'avatar') {
            selectCell(intersection.point);
            break;
        }

        // we selected the pitch
        if (obj.name === 'gridCube') {
            selectCell(intersection.point);
            break;
        }
    }
}


function selectCell(point) {
    // escape if we didnt click on the top-face of the cube
    if (point.y < -0.01) { return; }

    // get cell coords
    var x = Math.floor(point.x + gridW / 2);
    var y = Math.floor(point.z + gridH / 2);

    //console.log('selectCell(' + x + ',' + y +')');

    // check if the cell is ocuppied by an avatar and i so, select it
    grid.traverse(function(e) {
        if (e instanceof THREE.Mesh && e.name.split('-')[0] === 'avatar' ) {
            if (Math.floor(e.position.x) === x && Math.floor(e.position.z) === y) {
                selector.position.x = x + 0.5;
                selector.position.z = y + 0.5;
                selectAvatar(e);
                return;
            }
        }
    });

    // escape if no avatar is selected
    if (!selectedAvatar) { return; }

    // set cell as goal...
    var dir = new THREE.Vector3( x + 0.5 - selectedAvatar.position.x , 0, y + 0.5 - selectedAvatar.position.z );
    var origin = new THREE.Vector3( selectedAvatar.position.x, 0.01, selectedAvatar.position.z );
    var length = origin.distanceTo(new THREE.Vector3(x + 0.5, 0.01, y + 0.5));
    var color = 0xffff00;

    /*var a = selectedAvatar.position.x - (x + 0.5);
    var b = selectedAvatar.position.z - (y + 0.5);
    var length = Math.sqrt((a*a + b*b));*/

    console.log(length);
    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, color, 0.2, 0.2 );
    console.log(arrowHelper);

    //var sc = 1 / length;
    //arrowHelper.scale.set(sc, sc, sc);
    arrowHelper.cone.matrixAutoUpdate = true;
    arrowHelper.cone.scale.x = 0.01;
    arrowHelper.cone.rotation.x = 0;
    arrowHelper.cone.rotation.y = 0;
    //arrowHelper.cone.position.set(x+ 0.5, 0.01, y+0.5);

    //arrowHelper.cone.scale.set(0.1, 0.1, 0.1);

    grid.add( arrowHelper );

}


function selectAvatar(avatar) {
    selectedAvatar = avatar;
}