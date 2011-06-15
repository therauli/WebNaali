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
    };

    canvas.onmousemove = function(event) {
	mouseovercanvas = true;
    };

    canvas.onmouseout = function(event) {
	mouseovercanvas = false;
    };

    //disable context menu for canvas
    canvas.oncontextmenu = function(event) {
	return false;
    }

    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();


    // temp testing
    room = new GLGE.Collada();
    room.setId("Livingroom_static");
    room.setDocument("majbacka/livingroom__day.dae");
    scene.addCollada(room);

    keys = new GLGE.KeyInput();
    mouse = new GLGE.MouseInput(canvas);

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    camera = new GLGE.Camera();

    //camera.setRotOrder(GLGE.ROT_XYZ);
    camera.setType(GLGE.C_PERSPECTIVE);

    scene.setCamera(camera); 
    startRender()
}

function startRender() {
    rendertimerid = setInterval(render, 50);
}

function render() {
    renderer.render();
    checkkeys();
    checkmouse();

    now=parseInt(new Date().getTime());
    frameratebuffer = Math.round(((frameratebuffer * 9) + 1000/ (now - lasttime)) / 10);
    document.getElementById("fps").innerHTML = "FPS: " + frameratebuffer+ " #obj: " + scene.getObjects().length;

    document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();


    lasttime = now;
}

function checkkeys() {
 
    if (keys.isKeyPressed(GLGE.KI_PAGE_UP)) {
	addmove('Move,up');
    }
    if (keys.isKeyPressed(GLGE.KI_PAGE_DOWN)) {
	addmove('Move,down');
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

}

function checkmouse() {
    if (mouseovercanvas) {
	var mouseposition = mouse.getMousePosition();
	mouseposition.x -= document.getElementById("container").offsetLeft;
	mouseposition.y -= document.getElementById("container").offsetTop;
	
	if (mouse.isButtonDown(GLGE.MI_RIGHT) & mouseposition.x && mouseposition.y) {

	    var dx = old_mousex - mouseposition.x;
	    if (dx < 0) {
		addmove('Rotate,right');
	    } else if (dx > 0) {
		console.log('left');
	    }
	
	    old_mousex = mouseposition.x;
	    old_mousey = mouseposition.y;


	}
    }
}
