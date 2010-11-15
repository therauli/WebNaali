/*
  global.js - Stuff to handle things. Handles general avatar stuff.
*/

/* Ovien avaus
   Synkkaus
   skeletal animointi
*/

var canvas;
var width;
var height;
var myid;
var timerid;

var avatars = [];
var dynamicObjects = [];

var handlers = {};

function Door(id) {
    this.id = id;
    this.locked = false;
    this.opened = false;

    this.mouseClicked = function() {
	if (this.locked) {
	    console.log('Door is locked')
	} else {
	    this.opened = !this.opened
	    console.log('Door is now ' + this.opened)

	    // Get the corresponding GLGE Collada object
	    var object;
	    var children = scene.getChildren();
	    var i = 0;
	    for (i; i < children.length; i++) {
		if (children[i].id == this.id) {
		    object = children[i];
		    break
		}
	    }
	}
	console.log(object);
	updateObject(id, {locked: this.locked, opened: this.opened, position: [object.getLocX(), object.getLocY(), object.getLocX()]});
    }
    this.mouseHover = function() {
	console.log(this + ' is locked: ' + this.locked + ' and is opened: ' + this.opened);

    }
}

function sendSignal(signal) {
    console.log('sending: ' + signal);
    var action = signal.split(':')[0];
    var id = signal.split(':')[1];
    var object = dynamicObjects[id];

    if (action == 'mouseClicked') {
	object.mouseClicked();
    } else if (action == 'mouseHover') {
	object.mouseHover();
    }

    
}

function connectHandler(signal, id) {
    handlers[signal] = handlers[signal] || [];
    handlers[signal].push(id);

}

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
}

function getMyData() {
    var avatar = avatars[myid];
    var position = avatar.getLocation();
    var orientation = avatar.getOrientation();
    
    var data = {id: myid, position: position, orientation: orientation};
    return data;
}