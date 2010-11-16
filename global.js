/*
  global.js - Stuff to handle things. Handles general avatar stuff.
*/

var canvas;
var width;
var height;
var myid;
var timerid;

var handlers = {};

function setId() {
    myid = arguments[0]['id'];
}

//Obsolete:
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
    // FIXME change to work with new EC system
    var action = signal.split(':')[0];
    var id = signal.split(':')[1];
    console.log('sending: ' + action + ' to ' + id);
    // var object = dynamicObjects[id];

    // if (action == 'mouseClicked') {
    // 	object.mouseClicked();
    // } else if (action == 'mouseHover') {
    // 	object.mouseHover();
    // }
    
}

function connectHandler(signal, id) {
    handlers[signal] = handlers[signal] || [];
    handlers[signal].push(id);
}
