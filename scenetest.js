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
	xinc = xinc - parseFloat(trans[0]);
	zinc = zinc - parseFloat(trans[2]);
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
	rot = 0.1;
	
    }
    if (keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {
	rot = -0.1;
    }

    if (xinc != 0 || yinc != 0 || zinc != 0) {

    	camera.setLocX(camerapos.x + xinc);
    	camera.setLocY(camerapos.y + yinc);
    	camera.setLocZ(camerapos.z + zinc);
    }

    if (rot != 0) {
    	camera.setRotY(camera.getRotY() + rot);
    }

}
