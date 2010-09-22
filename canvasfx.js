function initGraffa() {

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
}

function drawAvatars() {
    //clear 
    ctx.fillRect(0, 0, width, height);

    for (id in avatars) {
	var avatar = avatars[id];

	ctx.save();
	
	ctx.translate(avatar.position[0] + 3, avatar.position[1] + 3);

	/* TODO: Make it rotate! */
	//ctx.rotate(avatar.roll);
	ctx.drawImage(avatar.sprite, -3, -3, 6, 6);
	
	ctx.restore();
    }
}
