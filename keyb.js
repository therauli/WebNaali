function keyPressHandler() {
    var keyChar = String.fromCharCode(event.charCode);
    keyChar = keyChar.toLowerCase();

    
    var action;

    var data = getMyData();

    switch(keyChar) {

    case 'a':
	action = 'left';
	break;

    case 'd':
	action = 'right';
	break
	
    case 'w':
	action = 'up';
	break

    case 's':
	action = 'down';
	break
    }


    if (action) {
	ws.send(JSON.stringify([action, data]));
    }
}

document.onkeypress = keyPressHandler;