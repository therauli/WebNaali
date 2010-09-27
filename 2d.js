
/* 
   2d.js - Draws avatars in 2d canvas and handles input for 2d, you
know keyb and mouse and stuff. It draws the coorinates of every avatar
seen in naali.

*/

var ctx;

function initGraffa() {

    canvas = document.getElementById('graffa');
    canvas.onmousedown = startFollow;
    canvas.onmouseup = stopFollow;

    if (canvas.getContext) {
	ctx = canvas.getContext('2d');
    } else {
	errorMsg('Cannot canvas');
	console.log('Cannot canvas');
    }
    
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, width, height);
    
    width = parseInt(canvas.width);
    height = parseInt(canvas.height);
    sendSize(width, height);

    document.onkeypress = keyPressHandler;
}

function Avatar(id, position, orientation) {
    this.id = id;

    this.position = position;
    this.orientation = orientation;
    
    this.url = "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";
    this.sprite = undefined;

    this.getLocation = function() {
	return this.position;
    }
    
    this.getOrientation = function() {
	return this.orientation;
    }
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
    drawAvatars()
}

function setAvatarPosition(avatar, position, orientation) {
    avatar.position = position;
    avatar.orientation = orientation;
}

function drawAvatars() {
    //clear 
    ctx.fillRect(0, 0, width, height);

    for (id in avatars) {
	var avatar = avatars[id];

	ctx.save();
	
	ctx.translate(avatar.position[0] + 3, (height - avatar.position[1]) + 3);

	ctx.rotate(avatar.getOrientation()[2]);
	ctx.drawImage(avatar.sprite, -3, -3, 6, 6);
	
	ctx.restore();
    }
}

function startFollow() {
    avatars[myid].position[0] = parseInt(event.clientX) - parseInt(canvas.offsetLeft);
    avatars[myid].position[1] = height - (parseInt(event.clientY) - parseInt(canvas.offsetTop));
    canvas.onmousemove = function() {
        avatars[myid].position[0] = parseInt(event.clientX) - parseInt(canvas.offsetLeft);
	avatars[myid].position[1] = height - (parseInt(event.clientY) - parseInt(canvas.offsetTop));
    };
}

function stopFollow() {
    canvas.onmousemove = null;
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
	avatars[myid].position[1] += 1;
	break;

    case 's':
	avatars[myid].position[1] -= 1;
	break;
    }

}
