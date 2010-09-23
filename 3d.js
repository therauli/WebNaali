/*
  3d.js - Drawing avs in three dimensions. Handles input also.
*/

var scene;
var renderer;
var camera;

function initGraffa() {
    canvas = document.getElementById('graffa');
    
    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    var keys = new GLGE.KeyInput();

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    camera = new GLGE.Camera();

    camera.setLoc("127", "127", "150");
    camera.setRotOrder(GLGE.ROT_XZY);
    camera.setType(GLGE.C_PERSPECTIVE);
    camera.setRot(3.141, 3.141, 0);

    scene.setCamera(camera);

}

function render() {
    renderer.render();
    document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();

}

function newAvatar() {
    var args = arguments[0];

    var id = args['id'];

    var position = args['position'];
    var orientation = args['orientation'];

    var avatar = new GLGE.Collada();
   
    avatar.setDocument("ankka.dae");
    avatar.setLoc(position[0], position[1], position[2]);

    //For some reason docURL is not set correctly. This is a
    //quick hack please kill it
    avatar.docURL="http://localhost:8000/WebNaali/ankka.dae";
    scene.addObject(avatar);
    //silly hack for compatibility with 2d client
    avatar.getOrientation = function() {
	return [avatar.getQuatW(), avatar.getQuatX(), avatar.getQuatY(), avatar.getQuatZ()];
    }
    avatar.getLocation = function() {
	return [avatar.getLocX(), avatar.getLocY(), avatar.getLocX()];
    }

    avatars[id] = avatar;
    

}

function setAvatarPosition(avatar, position, orientation) {
    avatar.setLocX(position[0]);
    avatar.setLocY(position[1]);
    avatar.setLocZ(position[2]);
    
    avatar.setQuatW(orientation[0]);
    avatar.setQuatX(orientation[1]);
    avatar.setQuatY(orientation[2]);
    avatar.setQuatZ(orientation[3]);

    console.log(avatar, position, orientation);
}


function drawAvatars() {
    render();
}
