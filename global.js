/*
  global.js - Stuff to handle things. Handles general avatar stuff.
*/

var canvas;
var width;
var height;
var myid;
var timerid;

var moves = new Array()
var old_moves = new Array()


var rightMouseDown = false;
var old_mousex = 0.0;
var old_mousey = 0.0; 

var handlers = {};

function setId() {
    myid = arguments[0]['id'];
}

function addmove(move) {
    moves.push(move)
}

function isin(value, list) {
    for (i = 0; i < list.length; i++) {
	if (value == list[i]) {
	    return true;
	}
    }
    return false;
}

function checkmove() {

    /*
      Does not work well except for walking and stopping. Need to
      rethink how keyboard mapping should be done.
     */

    for (i in moves) {
	var move = moves[i];
	if (!(isin(move, old_moves))) {
	    action = move.split(',')[0];
	    dir = move.split(',')[1];
	    //console.log('MOVE ' + move);
	    ws.send(JSON.stringify(["Action", {action: action, params: [dir], id: myid}]));
	}
    }

    for (i in old_moves) {
	var move = old_moves[i];
	if (!(isin(move, moves))) {
	    action = move.split(',')[0];
	    if (action == 'Rotate') {
		action = 'StopRotate';
	    } else if (action == 'Move') {
		action = 'Stop';
	    }
	    
	    dir = move.split(',')[1];

	    //console.log('STOP ' + move);
	    ws.send(JSON.stringify(["Action", {action: action, params: dir, id: myid}]));
	}
    }

    old_moves = moves.slice(0);
    moves = [];
}

function sendSignal(signal) {
    var action = signal.split(':')[0];
    var id = signal.split(':')[1];
    //console.log('sending: ' + action + ' to ' + id);
    
}

function connectHandler(signal, id) {
    handlers[signal] = handlers[signal] || [];
    handlers[signal].push(id);
}

function chatMessage(params) {
    var sender = params['sender'];
    var message = params['msg'];
    //console.log('GOT MESSAGE ' + sender + ": " + message);
    //FIXME use jquery or somthing smart to do this.
    var content = "";
    content = document.getElementById("chat").innerHTML;
    content = content.concat("<b>" + sender + ":</b> " + message + "<br>");
    document.getElementById("chat").innerHTML = content;
}

window.onload = function() {
    $('#chatinput').submit(function () {
	var message = $('#usermsg').val();
	$(':text', '#chatinput').val('');
	if (message.trim() == "") {
	    return false;
	}
	//console.log(message);
	ws.send(JSON.stringify(["chatMessage", {sender: "WebSocket", msg: message}]));
	return false;
    });
}

