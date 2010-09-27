/*
  3d.js - Drawing avs in three dimensions. Handles input also.
*/

var scene;
var renderer;
var camera;
var keys;

function initGraffa() {
    canvas = document.getElementById('graffa');
    
    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    keys = new GLGE.KeyInput();

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    camera = new GLGE.Camera();

    camera.setLoc(131.806, 48.9571, 28.7691)
    camera.setRotOrder(GLGE.ROT_XYZ);
    camera.setType(GLGE.C_PERSPECTIVE);
    camera.setRot(1.57, 0, 0);

    scene.setCamera(camera); 

}

function render() {
    renderer.render();
    checkkeys();
    document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();

}

function newAvatar() {
    console.log(arguments);
    var args = arguments[0];

    var id = args['id'];

    var position = args['position'];
    var orientation = args['orientation'];

    var avatar = new GLGE.Collada();
    
    avatar.setDocument("http://localhost:8000/WebNaali/ankka.dae");
    avatar.setLoc(position[0], position[1], position[2]);
    avatar.setRot(orientation[0], orientation[1], orientation[2]);

    scene.addObject(avatar);
    //silly hack for compatibility with 2d client

    avatar.getOrientation = function() {
	return [avatar.getRotX(), avatar.getRotY(), avatar.getRotZ()];
    }

    avatar.getLocation = function() {
	return [avatar.getLocX(), avatar.getLocY(), avatar.getLocZ()];
    }

    avatars[id] = avatar;
    
}

function checkkeys() {
    var camerapos = camera.getPosition();
    var camerarot = camera.getRotation();
    var mat = camera.getRotMatrix();
    
    var trans = GLGE.mulMat4Vec4(mat, [0, 0, -1, 1]);
    var magnitude = Math.pow(Math.pow(trans[0], 2) + Math.pow(trans[1], 2), 0,5);

    trans[0] = trans[0] / magnitude;
    trans[1] = trans[1] / magnitude;

    var yinc = 0;
    var xinc = 0;
    var zinc = 0;
    
    var rot = 0;
    
    if (keys.isKeyPressed(GLGE.KI_PAGE_UP)) {
	console.log(camerapos.z);
	zinc = 1;
    }
    if (keys.isKeyPressed(GLGE.KI_PAGE_DOWN)) {
	zinc = -1;
    }
    if (keys.isKeyPressed(GLGE.KI_W) || keys.isKeyPressed(GLGE.KI_UP_ARROW)) {
	xinc = xinc + parseFloat(trans[0]);
	yinc = yinc + parseFloat(trans[1]);
    }
    if (keys.isKeyPressed(GLGE.KI_S) || keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {
	xinc = xinc - parseFloat(trans[0]);
	yinc = yinc - parseFloat(trans[1]);
    }
    if (keys.isKeyPressed(GLGE.KI_A)) {
	xinc = xinc - parseFloat(trans[1]);
	yinc = yinc + parseFloat(trans[0]);
    }
    if (keys.isKeyPressed(GLGE.KI_D)) {
	xinc = xinc + parseFloat(trans[1]);
	yinc = yinc - parseFloat(trans[0]);
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


    // make wclients precense move also
    var avatar = avatars[myid];
    avatar.setLoc(camerapos.x, camerapos.y, camerapos.z+0.5);
    avatar.setRotZ(avatar.getOrientation()[2] + rot);
	
}

function setAvatarPosition(avatar, position, orientation) {
    avatar.setLocX(position[0]);
    avatar.setLocY(position[1]);
    avatar.setLocZ(position[2]);
    
    avatar.setRotX(orientation[0]);
    avatar.setRotY(orientation[1]);
    avatar.setRotZ(orientation[2]);

    console.log(avatar, position, orientation);
}


function drawAvatars() {
    render();
}
