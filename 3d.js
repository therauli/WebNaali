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
1
    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    keys = new GLGE.KeyInput();
    mouse = new GLGE.MouseInput(canvas);

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    camera = new GLGE.Camera();

    camera.setLoc(0, 0, 0)
    camera.setRotOrder(GLGE.ROT_XYZ);
    camera.setType(GLGE.C_PERSPECTIVE);
    camera.setRot(0, 0, 0);

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
    frameratebuffer = Math.round(((frameratebuffer * 9) + 1000/ (now - lasttime)) / 10);
    document.getElementById("fps").innerHTML = "FPS: " + frameratebuffer+ " #obj: " + scene.getObjects().length;

    document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();


    lasttime = now;
}

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
	addmove('Move,forward');
    }
    if (keys.isKeyPressed(GLGE.KI_S) || keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {
	addmove('Move,back');
    }
    if (keys.isKeyPressed(GLGE.KI_A)) {
	addmove('Move,left');
    }
    if (keys.isKeyPressed(GLGE.KI_D)) {
	addmove('Move,right');
    }
    if (keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {
	addmove('Rotate,left');
	
    }
    if (keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {
	addmove('Rotate,right');
    }

    checkmove();

    //make wclients precense move also
    var rotz = getAttr({'id': myid, 'component': 'EC_Placeable', 'keys': ['rotz']})[0] + rot;
    setAttr({id: myid, component: 'EC_Placeable', x: camerapos.x, y: camerapos.y, z: camerapos.z + 1, rotz: rotz});
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
