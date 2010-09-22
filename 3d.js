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

    camera.setLoc("127", "127", "150");
    camera.setRotOrder(GLGE.ROT_XZY);
    camera.setType(GLGE.C_PERSPECTIVE);
    camera.setRot(3.141, 3.141, 0);

    scene.setCamera(camera);

    d = new GLGE.Collada();
    d.setDocument("ankka.dae");
    d.setLoc("127", "127", "10");
    //For some reason docURL is not set correctly. This is a
    //quick hack please kill it
    d.docURL="http://localhost:8000/WebNaali/ankka.dae";
    scene.addObject(d);
    
    
    function checkkeys() {
	

    }


    function render() {
	renderer.render();
	document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();
	checkkeys();

    }

    setInterval(render, 1);

}

