/*
  3d.js - Drawing avs in three dimensions. Handles input also.
*/

var scene;
var renderer;
var camera;
var keys;
var mouse;
var hoverobject;
var mouseovercanvas;
var lasttime=0;
var frameratebuffer=60;
var start=parseInt(new Date().getTime());
var now;

/* TODO
 * hover/click handler system

*/

function initGraffa() {
    canvas = document.getElementById('graffa');

    canvas.onmouseover = function(event) {
	mouseovercanvas = true;
    }

    canvas.onmousemove = function(event) {
	mouseovercanvas = true;
    }

    canvas.onmoiseout = function(event) {
	mouseovercanvas = false;

    }

    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    keys = new GLGE.KeyInput();
    mouse = new GLGE.MouseInput(canvas);

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    camera = new GLGE.Camera();

    camera.setLoc(131.806, 48.9571, 28.7691)
    camera.setRotOrder(GLGE.ROT_XYZ);
    camera.setType(GLGE.C_PERSPECTIVE);
    camera.setRot(1.57, 0, 0);

    scene.setCamera(camera); 
    startRender()
}

function startRender() {
    rendertimerid = setInterval(render, 1);
}

function render() {
    renderer.render();
    checkkeys();
    checkmouse();

    now=parseInt(new Date().getTime());
    frameratebuffer=Math.round(((frameratebuffer*9)+1000/(now-lasttime))/10);
    document.getElementById("fps").innerHTML = "FPS: " + frameratebuffer+ " #obj: " + scene.getObjects().length;

    document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();


    lasttime = now;
}

function newAvatar() {
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

function addObject() {
    args = arguments[0]

    var id = args['id'];
    var position = args['position'];
    var orientation = args['orientation'];
    var xml = args['xml'];

    var object = new GLGE.Collada();
    object.setId(id);
    object.setDocument("http://localhost:8000/WebNaali/seymourplane_triangulate.dae");
    object.setScale(0.1);
    object.setLoc(position[0], position[1], position[2]);
    object.setRot(orientation[0], orientation[1], orientation[2]);
    
    scene.addObject(object);
    connectHandler('mouseHover:2', id)
    connectHandler('mouseClicked:2', id)
    door = new Door(id)
    
    dynamicObjects[id] = door;


}

function run(xml) {
    var entxml = (new DOMParser()).parseFromString(xml, "text/xml");
    for (c in entxml.getElementsByTagName("component")) {
        for (a in c.getElementsByTagName("attribute")) {
            n = a.getAttribute("name");
            v = a.getAttribute("value");
            if (n == "js_code") {

                eval(v);
            }
        }
	
    }
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
    avatar.setLoc(camerapos.x, camerapos.y, camerapos.z+1);
    avatar.setRotZ(avatar.getOrientation()[2] + rot);
	
}

function checkmouse() {
    if (mouseovercanvas) {
	var mouseposition = mouse.getMousePosition();
	mouseposition.x -= document.getElementById("container").offsetLeft;
	mouseposition.y -= document.getElementById("container").offsetTop;
	
	if (mouseposition.x && mouseposition.y) {
	    object = scene.pick(mouseposition.x, mouseposition.y).object
	    if (!object) {
		if (hoverobject) {
		    hoverobject.setScale(1);
		    document.getElementById("debug").innerHTML = "";
		}
	    } else {
		object.setScale(1.2);

		var temp_object = object;
		while (1) {
		    // We hit the mother load
		    if (temp_object.parent === scene) {
			if (mouse.isButtonDown(GLGE.MI_LEFT)) {
			    document.getElementById("debug").innerHTML = "Activate: " + temp_object.getId();
			    sendSignal('mouseClicked:'+temp_object.getId());
			} else {
			    sendSignal('mouseHover:'+temp_object.getId());
			    document.getElementById("debug").innerHTML = "Hover: " + temp_object.getId();
			}
			break;
		    }
		    temp_object = temp_object.parent
		}
	    }
	    hoverobject = object;
	}
    }
}

function setAvatarPosition(avatar, position, orientation) {
    avatar.setLocX(position[0]);
    avatar.setLocY(position[1]);
    avatar.setLocZ(position[2]);
    
    avatar.setRotX(orientation[0]);
    avatar.setRotY(orientation[1]);
    avatar.setRotZ(orientation[2]);

}

