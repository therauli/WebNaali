//for debugging purposes. Remove from global namespace when not needed
var scene;
var canvas;
var renderer;
var d;

window.onload = function() {
    canvas = document.getElementById('graffa');
    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    var keys = new GLGE.KeyInput();

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    var camera = new GLGE.Camera();

    camera.setLoc("-5", "-5", "3");
    camera.setRotOrder(GLGE.ROT_XZY);
    camera.setRot("0", "0", "0");
    camera.setType(GLGE.C_ORTHO);

    scene.setCamera(camera);

    var d = new GLGE.Collada();
    d.setDocument("glge_demo/duck.dae");
    d.setScale(0.01);
    d.setLoc("0", "0", "0");
    d.setRotY(1.57);
    d.setRotX(1.57);
    //For some reason docURL is not set correctly. This is a
    //quick hack please kill it
    d.docURL="http://localhost:8000/WebNaali/glge_demo/duck.dae";
    scene.addObject(d);
    
    
    function checkkeys() {
	

    }

    function mouselook() {
	if (mouseonvercanvas) {
	    var mousepos=mouse.getMousePosition();
	    mousepos.x=mousepos.x-document.getElementById("container").offsetLeft;
	    mousepos.y=mousepos.y-document.getElementById("container").offsetTop;
	    //...

	}
    }


    function render() {
	renderer.render();
	document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();
	checkkeys();

    }


    document.getElementById("canvas").onmouseover=function(e){mouseovercanvas=true;}
    document.getElementById("canvas").onmouseout=function(e){mouseovercanvas=false;}
    
    setInterval(render, 1);

}

