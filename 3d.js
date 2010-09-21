//for debugging purposes. Remove from global namespace when not needed
var scene;
var canvas;
var renderer;
var d;

window.onload = function() {
    canvas = document.getElementById('graffa');
    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    scene.setAmbientColor('#666');
    
    renderer.setScene(scene);

    var camera = new GLGE.Camera();

    camera.setLoc("1", "20", "8");
    camera.setRotOrder(GLGE.ROT_XZY);
    camera.setRot("1.56", "3.141", "0");
    camera.setType(GLGE.C_ORTHO);

    scene.setCamera(camera);

    

    var d = new GLGE.Collada();
    d.setDocument("glge_demo/duck.dae");
    d.setScale(0.05);
    d.setLocY("-15");
    d.setRotY(1.57);
    d.setRotX(1.57);
    //For some reason docURL is not set correctly. This is a
    //quick hack please kill it
    d.docURL="http://localhost:8000/WebNaali/glge_demo/duck.dae";
    scene.addObject(d);
    
    function render() {
	renderer.render()

    }

    setInterval(render, 1);
    renderer.render()

}

