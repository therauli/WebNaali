/*
  3d.js - Drawing avs in three dimensions. Handles input also.
*/

//for debugging purposes. Remove from global namespace when not needed
var scene;
var renderer;

function initGraffa() {
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
    avatar.setLoc("127", "127", "10");

    //For some reason docURL is not set correctly. This is a
    //quick hack please kill it
    avatar.docURL="http://localhost:8000/WebNaali/ankka.dae";
    scene.addObject(avatar);
    
    avatars[id] = avatar;

}

function setAvatarPosition(avatar, position, orientation) {
    avatar.setLoc(position);
    avatar.setQuat(orientation);
}


function drawAvatars() {
    render()
}