= WebNaali =
 - a WebGL client for realXtend naali.

== How to use ==

Launch tundra server with websocketserver module enabled. 
...
Works with tundra server 1.0.8 

WebNaali uses GLGE (http://glge.org) for WebGL. For the client example
ws3dclient.html you need to have GLGE installed in the same directory.

If you want to display scenes (collada files) you can use
scenetest.html.

== Configuring Tundra ==

Before you can use WebNaali you need to enable the websocket server
module in tundra:

 1. Create a file called "websocket.ini" (the file can be of any name
 as long as it has the .ini suffix) or modify the default.ini file in
 the pymodules directory.

 2a. If you are using the default.ini just uncomment the lines
  ;[websocketserver.NaaliWebsocketServer]
  ;port= 9999
 and set the port you want to use.

 2b. If you want to create your own .ini file write the following lines to it
  [websocketserver.NaaliWebsocketServer]
  port= 9999
 and set the correct port number

 3. Launch tundra.

 4. Enjoy

== Controls ==

PLEASE NOTE You need to have the mouse cursor over the canvas in order
to move around.

Turning:	left and right arrow
Move forward: 	w or up arrow
move back: 	s or down arrow
strafe left:	a
strafe right:	d

You can also turn left/right with the mouse by holding the right mouse
button down and then moving the mouse in the canvas.

== Requirements ==

In order to WebNaali to work you need to have the AvatarApplication in
your scene in tundra. If you want to use chat you also need to have
the ChatApplication.
