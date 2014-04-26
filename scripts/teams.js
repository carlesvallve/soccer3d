var THREE = window.THREE;

var team1, team2;

function createTeam(num, field, formation, colors) {
    console.log('TEAM', num + ':', formation.system);

    // set formation spacing
    formation.spacing = 0.575;

    // set team object
    var team = {
        num: num,
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

        // apply spacing
        if (i > 1) { z = Math.floor(z * formation.spacing); }

        // apply field
        if (field === 'bottom') { z = gridH - 1 - z; }

        // create avatar
        team.players.push(createAvatar(i, colors, x, z ));
    }

    return team;
}


function getRandomFormation() {
    // choose random formation from 1 to 146
    var num = 1 + Math.floor(Math.random() * 146);
    return formations['Formation:' + num];
}


function liberateAvatarsFromPhysics(team) {
    for (var i = 0; i < 11; i++) {
        var avatar = team.players[i];
        avatar.__dirtyRotation = true;
        avatar.__dirtyPosition = true;
    }

}