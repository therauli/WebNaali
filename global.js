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

var OPENPOS = [101.862, 82.6978, 24.9221];
var CLOSEPOS = [99.65, 82.6978, 24.9221];

function Door(id) {
    this.id = id;
    this.locked = false;
    this.open = false;

    this.mouseClicked = function() {
	if (this.locked) {
	    console.log('Door is locked')
	} else {
	    this.open = !this.open
	    console.log('Door is now ' + this.open)

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
	    
	    if (this.open) {
		object.setLoc(OPENPOS[0], OPENPOS[1], OPENPOS[2]);
	    } else {
		object.setLoc(CLOSEPOS[0], CLOSEPOS[1], CLOSEPOS[2]);
	    }
		
	}
	updateObject(id, {locked: this.locked, open: this.open, postion: object.getLoc()})
    }
    this.mouseHover = function() {
	console.log(this + ' is locked: ' + this.locked + ' and is open: ' + this.open);

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