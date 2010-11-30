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
    rendertimerid = setInterval(render, 50);
}

function render() {
    renderer.render();
    checkkeys();
    //checkmouse();

    now=parseInt(new Date().getTime());
    frameratebuffer=Math.round(((frameratebuffer*9)+1000/(now-lasttime))/10);
    document.getElementById("fps").innerHTML = "FPS: " + frameratebuffer+ " #obj: " + scene.getObjects().length;

    document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();


    lasttime = now;
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
	addmove('forward');

    }
    if (keys.isKeyPressed(GLGE.KI_S) || keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {
	xinc = xinc - parseFloat(trans[0]);
	yinc = yinc - parseFloat(trans[1]);
	addmove('back');

    }
    if (keys.isKeyPressed(GLGE.KI_A)) {
	xinc = xinc - parseFloat(trans[1]);
	yinc = yinc + parseFloat(trans[0]);
	addmove('left')
    }
    if (keys.isKeyPressed(GLGE.KI_D)) {
	xinc = xinc + parseFloat(trans[1]);
	yinc = yinc - parseFloat(trans[0]);
	addmove('right')
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

    checkmove();


    // make wclients precense move also
    //var rotz = getAttr({'id': myid, 'component': 'EC_Placeable', 'keys': ['rotz']})[0] + rot;
    //setAttr({id: myid, component: 'EC_Placeable', x: camerapos.x, y: camerapos.y, z: camerapos.z + 1, rotz: rotz});
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
