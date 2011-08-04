/* Sockket.js

Stuff to handle WebSocket communication 

*/

var ws = new WebSocket("ws://" + websocket_host + ":" + websocket_port);

ws.onopen = function() {
    var data = ["CONNECTED", {}];
    ws.send(JSON.stringify(data));

    console.log("Connected");
};

ws.onmessage = function (evt) {
    //console.log('Got message: ' + evt.data);
    parseMessage(evt.data);
};

ws.onclose = function(evt) {
    console.log("Connection closed.");
};

function sendSize(width, height) {
    var data = ["setSize", {width: width, height: height}];
    ws.send(JSON.stringify(data));
}

function parseMessage(message) {
    var message_json = JSON.parse(message);
    var func = message_json[0];
    var params = message_json[1];
    eval(func)(params);
}

function errorMsg(message) {
    ws.send('["ERROR", '+ message +']');
}

function logMessage() {
    console.log('logMessage: ' + JSON.stringify(arguments[0]['message']));
}

function updateAttr() {
    /* Don't ask for update if server hasn't set the id yet */
    /* Currently only syncs EC_Placeable */

    if (myid) {
	var values = getAttr({'id': myid, 'component': 'EC_Placeable', 'keys': ['x', 'y', 'z', 'rotx', 'roty', 'rotz']});

	var data = ["setAttr", {id: myid,
				component: "EC_Placeable", 
				x: values[0],
				y: values[1],
				z: values[2],
				rotx: values[3],
				roty: values[5],
				rotz: values[4]}];
	ws.send(JSON.stringify(data));
    }
}


function reboot() {
    var data = ['reboot', {}];
    clearInterval(sockettimerid);
    ws.send(JSON.stringify(data));
}

function updateObject(id, newdata) {
    var data = ['updateObject', {id: id, data: newdata}];
    ws.send(JSON.stringify(data));
}

//sockettimerid = setInterval(updateAttr, 50);

