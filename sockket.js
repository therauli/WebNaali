/* Sockket.js

Stuff to handle WebSocket communication 

*/
var ws = new WebSocket("ws://127.0.0.1:9999");

ws.onopen = function() {
    var data = ["CONNECTED", {}];
    ws.send(JSON.stringify(data));

    console.log("Connected");
};

ws.onmessage = function (evt) {
    console.log('Got message: ' + evt.data);
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

function getUpdate() {
    //var ship = ships[myid];
    //console.log(ship);
    var data = ["giev update", getAllData()]
    ws.send(JSON.stringify(data))
    drawShips()
}

function reboot() {
    var data = ['reboot', {}];
    ws.send(JSON.stringify(data));
}


setInterval(getUpdate, 500);