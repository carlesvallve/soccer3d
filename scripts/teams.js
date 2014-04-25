var THREE = window.THREE;

var team1, team2;

function createTeam(num, field, formation, colors) {
    // set team object

    var team = {
        num: num,
        formation: formation,
        colors: colors,
        players: []
    };

    formation.spacing = 0.575;

    console.log('TEAM', num + ':', formation.system);


    // load team players

    for (var i = 1; i <= 11; i++) {
        loadAvatar(i, colors, function (num, avatar) {
            // TODO: Find a better way to locate avatars with strechable formations

            // get formation position
            var fpos = formation.positions[num - 1];
            var x = Math.floor(4 + fpos.x / 12);
            var z = Math.floor(- 6 + gridH - fpos.y / 10);

            if (num > 1) { z = Math.floor(z * formation.spacing); }

            if (field === 'bottom') { z = gridH - 1 - z; }

            // locate avatar
            avatar.position.x = 0.5 + x;
            avatar.position.y = -0.02;
            avatar.position.z = 0.5 + z;
            avatar.rotation.y = field === 'top' ? 0 : Math.PI;

            // add avatar to players list
            team.players.push(avatar)
        });
    }

    return team;
}


function getRandomFormation() {
    // choose random formation from 1 to 146
    var num = 1 + Math.floor(Math.random() * 146);
    return formations['Formation:' + num];
}