onload = main;
var ctx;
var width;
var height;
var myid;
var ships = new Array();

function main() {
}

function setId() {
    myid = arguments[0]['id'];
}

function Ship(id, x, y, dx, dy, angle, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.angle = angle;
    this.url =  "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";
    this.sprite = undefined;
    this.speed = speed;

}

function newShip() {
    console.log(arguments);
    var x = arguments[0]['x'];
    var y = arguments[0]['y'];
    var id = arguments[0]['id'];
    var dx = arguments[0]['dx'];
    var dy = arguments[0]['dy'];
    var angle = arguments[0]['angle']
    var speed = arguments[0]['speed']

    var ship = new Ship(id, x, y, dx, dy, angle, speed);

    ship.sprite = new Image();
    ship.sprite.src = "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";
    ships[id] = ship;
}

function stopAll() {
    for (id in ships) {
	var ship = ships[id];
	ship.dx = 0;
	ship.dy = 0;
    }
}


function updateShip() {
    var args = arguments[0];
    var id = args['id'];
    var ship = ships[id];
    
    for (var foo in ships) {
	console.log(foo);
    }

    if (ship == undefined) {
	var x = args['x'];
	var y = args['y'];
	var dx = args['dx'];
	var dy = args['dy'];
	var angle = args['angle'];
	var speed = args['speed'];
	newShip({id: id, x: x, y: y, dx: dx, dy: dy, angle: angle, speed: speed});

    } else {
	ship.x = args['x'];
	ship.y = args['y'];
	ship.dx = args['dx'];
	ship.dy = args['dy'];
	ship.angle = args['angle'];
	ship.speed = args['speed'];
    }

    drawShips();

}

function getMyData() {
    var ship = ships[myid];
    var data = {
	id: myid,
	x: ship.x,
	y: ship.y,
	dx: ship.dx,
	dy: ship.dy,
	angle: ship.angle,
	speed: ship.speed,
    };
    return data;
}

function getAllData() {
    var data = {};
    for (id in ships) {
	data[id] = getData(id);
    }
    
    return data;

}

function getData(id) {
    var data = {};
    var ship = ships[id];
    for (item in ship) {
	if ((item == 'sprite') || (item == 'url')) {
	    continue;
	}
	data[item] = ship[item];
    }
    return data;
}


