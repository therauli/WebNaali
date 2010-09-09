onload = main;
var ctx;
var canvas;
var width;
var height;
var myid = 1;
var avatars = new Array();

function main() {
    canvas = document.getElementById('graffa');
    canvas.onmousedown = moveTo;
    newAvatar({x: 50, y: 50, id: 1, dx: 0, dy: 0, angle: 0, speed: 0});
    initGraffa();

}

function moveTo() {
    console.log(event.clientX+" : "+event.clientY)
    var avatar = avatars[myid];

    avatar.x = parseInt(event.clientX);
    avatar.y = parseInt(event.clientY);
}

function setId() {
    myid = arguments[0]['id'];
}

function Avatar(id, x, y, dx, dy, angle, speed) {
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

function newAvatar() {
    console.log(arguments);
    var x = arguments[0]['x'];
    var y = arguments[0]['y'];
    var id = arguments[0]['id'];
    var dx = arguments[0]['dx'];
    var dy = arguments[0]['dy'];
    var angle = arguments[0]['angle']
    var speed = arguments[0]['speed']

    var avatar = new Avatar(id, x, y, dx, dy, angle, speed);

    avatar.sprite = new Image();
    avatar.sprite.src = "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";
    avatars[id] = avatar;
}

function stopAll() {
    for (id in avatars) {
	var avatar = avatars[id];
	avatar.dx = 0;
	avatar.dy = 0;
    }
}


function updateAvatar() {
    var args = arguments[0];
    var id = args['id'];
    var avatar = avatars[id];
    
    for (var foo in avatars) {
	console.log(foo);
    }

    if (avatar == undefined) {
	var x = args['x'];
	var y = args['y'];
	var dx = args['dx'];
	var dy = args['dy'];
	var angle = args['angle'];
	var speed = args['speed'];
	newAvatar({id: id, x: x, y: y, dx: dx, dy: dy, angle: angle, speed: speed});

    } else {
	avatar.x = args['x'];
	avatar.y = args['y'];
	avatar.dx = args['dx'];
	avatar.dy = args['dy'];
	avatar.angle = args['angle'];
	avatar.speed = args['speed'];
    }

    drawAvatars();

}

function getMyData() {
    var avatar = avatars[myid];
    var data = {
	id: myid,
	x: avatar.x,
	y: avatar.y,
	dx: avatar.dx,
	dy: avatar.dy,
	angle: avatar.angle,
	speed: avatar.speed,
    };
    return data;
}

function getAllData() {
    var data = {};
    for (id in avatars) {
	data[id] = getData(id);
    }
    
    return data;

}

function getData(id) {
    var data = {};
    var avatar = avatars[id];
    for (item in avatar) {
	if ((item == 'sprite') || (item == 'url')) {
	    continue;
	}
	data[item] = avatar[item];
    }
    return data;
}

