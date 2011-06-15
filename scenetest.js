ws = {};

ws.send = function(string) {
};

function checkkeys() {
    var camerapos = camera.getPosition();
    var camerarot = camera.getRotation();
    var mat = camera.getRotMatrix();
    
    var trans = GLGE.mulMat4Vec4(mat, [0, 0, -1, 1]);
    var magnitude = Math.sqrt(Math.pow(trans[0], 2) + Math.pow(trans[2], 2));
    
    trans[0] = trans[0] / magnitude;
    trans[2] = trans[2] / magnitude;
    
    var yinc = 0;
    var xinc = 0;
    var zinc = 0;
    
    var rot = 0;
 
    if (keys.isKeyPressed(GLGE.KI_PAGE_UP)) {
	yinc = 1;
    }
    if (keys.isKeyPressed(GLGE.KI_PAGE_DOWN)) {
	yinc = -1;
    }
    if (keys.isKeyPressed(GLGE.KI_W) || keys.isKeyPressed(GLGE.KI_UP_ARROW)) {
	xinc = xinc + parseFloat(trans[0]);
	zinc = zinc + parseFloat(trans[2]);
    }
    if (keys.isKeyPressed(GLGE.KI_S) || keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {
	xinc = xinc - parseFloat(trans[0]);
	zinc = zinc - parseFloat(trans[2]);

    }
    if (keys.isKeyPressed(GLGE.KI_A)) {
	xinc = xinc + parseFloat(trans[2]);
	zinc = zinc - parseFloat(trans[0]);
    }
    if (keys.isKeyPressed(GLGE.KI_D)) {
	xinc = xinc - parseFloat(trans[2]);
	zinc = zinc + parseFloat(trans[0]);
    }
    if (keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {
	rot = 0.03;
	
    }
    if (keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {
	rot = -0.03;
    }

    if (xinc != 0 || yinc != 0 || zinc != 0) {
	var movediv = 7;
    	camera.setLocX(camerapos.x + (xinc / movediv));
    	camera.setLocY(camerapos.y + (yinc / movediv));
    	camera.setLocZ(camerapos.z + (zinc / movediv));
    }

    if (rot != 0) {
    	camera.setRotY(camera.getRotY() + rot);
    }

}

function checkmouse() {
    var mouseposition = mouse.getMousePosition();
    mouseposition.x -= document.getElementById("container").offsetLeft;
    mouseposition.y -= document.getElementById("container").offsetTop;
    var rot = 0;
   
    if (mouseposition.x && mouseposition.y) {

	var dx = old_mousex - mouseposition.x;
	if (dx < 0) {
	    console.log('right');
	    rot = -0.03;
	} else if (dx > 0) {
	    rot = 0.03;
	    console.log('left');
	}
	
	if (rot != 0) {
    	    camera.setRotY(camera.getRotY() + rot);
	}


	old_mousex = mouseposition.x;
	old_mousey = mouseposition.y;
    }
    
}