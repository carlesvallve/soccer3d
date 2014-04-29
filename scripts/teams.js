var THREE = window.THREE;

var team1, team2, avatars = [];

function createTeam(num, field, formation, colors) {
    console.log('TEAM', num + ':', formation.system);

    // set formation spacing
    formation.spacing = 0.575;

    // set team object
    var team = {
        num: num,
        field: field,
        formation: formation,
        colors: colors,
        players: []
    };

    // load team players
    for (var i = 1; i <= 11; i++) { // 11
        // get formation position
        var pos = formation.positions[i - 1];
        var x = Math.floor(4 + pos.x / 12);
        var z = Math.floor(- 6 + gridH - pos.y / 10);
        var rot = 0;

        // apply spacing
        if (i > 1) { z = Math.floor(z * formation.spacing); }

        // apply field
        if (field === 'bottom') {
            z = gridH - 1 - z;
            rot = Math.PI;
        }

        // create avatar
        var avatar = createAvatar(team, i, colors, x, z, rot);


        team.players.push(avatar);
        avatars.push(avatar);
    }

    return team;
}


function getRandomFormation() {
    // choose random formation from 1 to 146
    var num = 1 + Math.floor(Math.random() * 146);
    return formations['Formation:' + num];
}


function selectNearestAvatarToBall() {
    var selected;
    var minDist = 1000;
    for (var i = 0; i < avatars.length; i++) {
        var avatar = avatars[i];
        var dist = avatar.position.distanceTo(ball.position);
        if (dist <= minDist) {
            selected = avatar;
            minDist = dist;
        }
    }

    if (selected && selected !== selectedAvatar) {
        selectAvatar(selected);
    }
}


