/*
  global.js - Stuff to handle things. Handles general avatar stuff.
*/

var canvas;
var width;
var height;
var myid;
var avatars = new Array();


function setId() {
    myid = arguments[0]['id'];
}

function updateAvatar() {
    var args = arguments[0];
    var id = args['id'];
    var avatar = avatars[id];
    
    if (avatar == undefined) {
	/* If there is no avatar, create it*/
	newAvatar(arguments[0]);
    } else {
	setAvatarPosition(avatar, args['position'], args['orientation']);
    }

    drawAvatars();

}

function getMyData() {
    var avatar = avatars[myid];
    var data = {id: myid, position: avatar.position, orientation: avatar.orientation};
    return data;
}

function getAllData() {
    var data = {};
    for (id in avatars) {
	data[id] = getData(id);
    }
    return data;

}

function getData(id) {
    var data = {};
    var avatar = avatars[id];
    for (item in avatar) {
	if ((item == 'sprite') || (item == 'url')) {
	    continue;
	}
	data[item] = avatar[item];
    }
    return data;
}

