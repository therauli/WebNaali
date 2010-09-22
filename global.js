onload = main;
var ctx;
var canvas;
var width;
var height;
var myid;
var avatars = new Array();

function main() {
    canvas = document.getElementById('graffa');
    canvas.onmousedown = startFollow;
    canvas.onmouseup = stopFollow;

}

function startFollow() {
    avatars[myid].position[0] = parseInt(event.clientX) - parseInt(canvas.offsetLeft);
    avatars[myid].position[1] = parseInt(event.clientY) - parseInt(canvas.offsetTop);
    canvas.onmousemove = function() {
        avatars[myid].position[0] = parseInt(event.clientX) - parseInt(canvas.offsetLeft);
	avatars[myid].position[1] = parseInt(event.clientY) - parseInt(canvas.offsetTop);
    };
}

function stopFollow() {
    canvas.onmousemove = null;
}

function setId() {
    myid = arguments[0]['id'];
}

function Avatar(id, position, orientation) {
    this.id = id;

    this.position = position;
    this.orientation = orientation;

    this.url =  "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";
    this.sprite = undefined;
}

function newAvatar() {
    var args = arguments[0];

    var id = args['id'];

    var position = args['position'];
    var orientation = args['orientation'];
    
    var avatar = new Avatar(id, position, orientation);

    avatar.sprite = new Image();
    avatar.sprite.src = "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";

    avatars[id] = avatar;
}

function updateAvatar() {
    var args = arguments[0];
    var id = args['id'];
    var avatar = avatars[id];
    
    if (avatar == undefined) {
	/* If there is no avatar, create it*/
	newAvatar(arguments[0]);
    } else {
	avatar.position = args['position'];
	avatar.orientation = args['orientation'];
    }

    drawAvatars();

}

function getMyData() {
    var avatar = avatars[myid];
    var data = {id: myid, position: avatar.position, orientation: avatar.orientation};
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

function keyPressHandler() {
    var keyChar = String.fromCharCode(event.charCode);
    keyChar = keyChar.toLowerCase();

    switch(keyChar) {
	
    case 'a':
	avatars[myid].position[0] -= 1;
	break;
	
    case 'd':
	avatars[myid].position[0] += 1;
	break;
	
    case 'w':
	avatars[myid].position[1] -= 1;
	break;

    case 's':
	avatars[myid].position[1] += 1;
	break;
    }

}

document.onkeypress = keyPressHandler;
