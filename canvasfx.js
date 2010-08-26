function initGraffa() {
    var canvas = document.getElementById('graffa');

    if (canvas.getContext) {
	ctx = canvas.getContext('2d');
	// drawing code here
    } else {
	errorMsg('Cannot canvas')
	console.log('Cannot canvas')
    }
    
    ctx.fillStyle = "#fff";

    width = parseInt(canvas.width);
    height = parseInt(canvas.height);
    sendSize(width, height)

}

function newShip() {
    console.log(arguments);
    var x = arguments[0]['x'];
    var y = arguments[0]['y'];
    var id = arguments[0]['id'];
    var dx = arguments[0]['dx'];
    var dy = arguments[0]['dy'];
    var angle = arguments[0]['angle']
    var speed = arguments[0]['speed']

    var ship = new Ship(id, x, y, dx, dy, angle, speed);

    ship.sprite = new Image();
    ship.sprite.src = "http://upload.wikimedia.org/wikipedia/commons/a/ac/Sprite_bottle.JPG";
    ships[id] = ship;
}

function stopAll() {
    for (id in ships) {
	var ship = ships[id];
	ship.dx = 0;
	ship.dy = 0;
    }
}

function moveSprite() {
    var id = arguments[0]['id']
    ship = ships[id];
    dy = arguments[0]['dy'] || ship.dy;
    dx = arguments[0]['dx'] || ship.dx;

    //save context and translate
    ctx.save();
    y = y + dy;
    x = x + dx;
 
    ctx.translate(x + 25, y + 25);
    ctx.rotate(angle);
    ctx.drawImage(sprite, -25, -25, 50, 50);

    ctx.restore();

}

function drawShips() {
    //clear 
    ctx.fillRect(0, 0, width, height);

    for (id in ships) {
	var ship = ships[id];

	ctx.save();
	ship.y = ship.y + ship.dy;
	ship.x = ship.x + ship.dx;
	
	ctx.translate(ship.x + 25, ship.y + 25);
	ctx.rotate(ship.angle);

	ctx.drawImage(ship.sprite, -25, -25, 50, 50);
	
	ctx.restore();
	

    }

}


