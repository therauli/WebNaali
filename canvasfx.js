function initGraffa() {

    if (canvas.getContext) {
	ctx = canvas.getContext('2d');
	// drawing code here
    } else {
	errorMsg('Cannot canvas');
	console.log('Cannot canvas');
    }
    
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, width, height);
    
    test = new Image();
    test.src = "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";    
    ctx.drawImage(test, 50,50, 6, 6);
    width = parseInt(canvas.width);
    height = parseInt(canvas.height);
    sendSize(width, height);

}

function newAvatar() {
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

function drawAvatars() {
    //clear 
    ctx.fillRect(0, 0, width, height);

    for (id in avatars) {
	var avatar = avatars[id];

	ctx.save();
	avatar.y = avatar.y + avatar.dy;
	avatar.x = avatar.x + avatar.dx;
	
	ctx.translate(avatar.x + 3, avatar.y + 3);
	ctx.rotate(avatar.angle);

	ctx.drawImage(avatar.sprite, -3, -3, 6, 6);
	
	ctx.restore();
    }

}

