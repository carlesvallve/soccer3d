Physijs.scripts.worker = '/soccer3d/lib/physijs/physijs_worker.js';
Physijs.scripts.ammo = '/soccer3d/lib/physijs/ammo.js';


var formations;

// load formations
loadJSON('./assets/data/formations.json', function (data) {
    // record formations object
    formations = data;

    // init application
    initApp();
});


function loadJSON(filename, cb) {
    if (!filename) {
        console.error('json file not found');
        return cb(null);
    }

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filename + '?' + new Date().getTime(), true);

    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            cb(JSON.parse(xobj.responseText));
        }
    };

    xobj.send(null);
}


