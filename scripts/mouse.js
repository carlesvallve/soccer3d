var THREE = window.THREE;

/*
TODO: We want to make finger swipes and translate them to a vector over the field
TODO: This vector must be in relation to the position/direction of the camera
when we click, we can figure out a point on the field,
so maybe we should cast a ray every onmousemove and get an array of points
 */

// Picking stuff

var projector = new THREE.Projector();
var mouseVector = new THREE.Vector3();

var mouseIsDown = false;
var selectedPoint;

window.document.addEventListener( 'mousedown', onMouseDown, false );
//window.document.addEventListener( 'mousemove', onMouseMove, false );
window.document.addEventListener( 'mouseup', onMouseUp, false );


function onMouseUp( e ) {
    mouseIsDown = false;
    if (selectedAvatar && selectedPoint) {
        moveAvatarTo(selectedAvatar, selectedPoint, 100);
    }

}


//function onMouseMove( e ) {}


function onMouseDown( e ) {
    mouseIsDown = true;
    selectedPoint = null;
    checkMouseIntersections(e);

    if (selectedAvatar && selectedPoint) {
        ballSelector.visible = true;
        selectedAvatar.force = 0;
        rotateAvatarTo(selectedAvatar, selectedPoint, 100);
    }
}


function checkMouseIntersections(e) {
    e.preventDefault();

    // mouse left button

    if ( e.button === 0 ) {
        //scene.updateMatrixWorld();

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

            if (obj.name === 'ball') { continue; }

            //console.log(obj.name);

            // we selected the ball
            if (obj.name === 'ball') {
                pushBall(intersection.point);
                return;
            }

            // we selected an avatar
            if (obj !== selectedAvatar && obj.name.split('-')[0] === 'avatar') {
                selectAvatar(obj);
                return;
            }


            // we selected the pitch
            if (obj.name === 'pitch') {
                selectCell(intersection.point);
                return;
            }
        }

    }
}


/**
 * SelectCell gets grid coords on given point and checks for avatar selection or movement
 * @param point
 * @param avatar
 */
function selectCell(point, avatar) {
    // escape if we didnt click on the top-face of the cube
    if (point.y < -0.01) { return; }

    // get cell coords
    //var x = point.x; // Math.floor(point.x);
    //var y = point.z; // Math.floor(point.z);
    //console.log('selectCell(' + x + ',' + y +')');

    /*var cell = { x: x, y: y };

    if (cell.x === selectedCell && cell.y === selectedCell.y) { return; }
    selectedCell = cell;*/

    // check for avatar selection
    /*if (avatar) {
        selectAvatar(avatar);
    } else {
        // check if the cell is ocuppied by an avatar and i so, select it
        scene.traverse(function(e) {
            //if (Math.floor(e.position.x) === x && Math.floor(e.position.z) === y) {
                if (e.name.split('-')[0] === 'avatar' ) {
                    selectAvatar(e);
                    return;
                }
                if (e.name.split('-')[0] === 'avatarModel' ) {
                    selectAvatar(e.parent);
                    return;
                }
            //}
        });
    }*/

    // escape if no avatar is selected
    if (!selectedAvatar) { return; }

    // record goal 3d point
    //moveAvatarTo(selectedAvatar, new THREE.Vector3( x, selectedAvatar.position.y, y), 100);
    selectedPoint = new THREE.Vector3(point.x, selectedAvatar.position.y, point.z);
}


// ************************************************************************
// ************************************************************************


function createArrowHelper() {
    // create movement arrow
    /*var dir = new THREE.Vector3( x + 0.5 - selectedAvatar.position.x , 0, y + 0.5 - selectedAvatar.position.z );
     var origin = new THREE.Vector3( selectedAvatar.position.x, 0.005, selectedAvatar.position.z );
     var length = origin.distanceTo(new THREE.Vector3(x + 0.5, 0.005, y + 0.5));
     var color = 0xff9900; // Math.floor(Math.random() * 16777215);
     var arrowHelper = new THREE.ArrowHelper( dir, origin, length, color, 0.1, 0.1 );
     grid.add( arrowHelper );*/
}




