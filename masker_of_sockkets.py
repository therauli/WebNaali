from eventlet import wsgi, websocket
import math
import random
import eventlet
import random
import json

# [event, {data}]
#
#
#

clients = set()
       
def sendAll(data):
    for client in clients:
        client.send(json.dumps(data))

ships = dict()

@websocket.WebSocketWSGI
def hello_world(ws):
    clients.add(ws)
    
    while True:
            
        msg = ws.wait()
        print msg
        function, params = json.loads(msg)
        myid = random.randrange(1,10000)
        if function == 'CONNECTED':
            ws.send(json.dumps(['initGraffa', {}]))
            x = random.randrange(10, 180)
            y = random.randrange(10, 180)
            ws.send(json.dumps(['setId', {'id': myid}]))
            sendAll(['newShip', {'id': myid, 'x': x, 'y': y, 'dx' : 0, 'dy': 0, 'angle': 0, 'speed': 0}])
        elif function == 'Naps':
            ws.send(json.dumps(['logMessage', {'message': 'Naps itelles!'}]))
        elif function in ['up', 'down', 'left', 'right']:
            
            id = params.get('id')
            x = params.get('x')
            y = params.get('y')
            dx = params.get('dx')
            dy = params.get('dy')
            angle = params.get('angle')
            speed = params.get('speed')

            if function == 'left':
                angle -= math.pi/16
            elif function == 'right':
                angle += math.pi/16
            elif function == 'up':
                speed = max(-5, speed - 1)
              
            elif function == 'down':
                speed = min(5, speed + 1)

            sendAll(['updateShip',
                     {'id': id,
                      'angle': angle,
                      'x': x,
                      'y': y,
                      'dx': dx,
                      'dy': dy,
                      'speed': speed,
                      }])
            
        elif function == 'giev update':
            for id, data in params.items():

                x = data.get('x')
                y = data.get('y')
                dx = data.get('dx')
                dy = data.get('dy')
                angle = data.get('angle')
                speed = data.get('speed')

                if x < 25 or x >= 175:
                    speed *= -1

                if y < 25 or y > 175:
                    speed *= -1

                if y < 25:
                    y = 25
                elif y > 175:
                    y = 175

                if x < 25:
                    x = 25
                elif y > 175:
                    x = 175
                    
                
                dx = -round(math.cos(-(angle - math.pi/2)) * speed, 3)
                dy = -round(math.sin(angle - math.pi/2) * speed, 3)

                sendAll(['updateShip',
                         {'id': id,
                          'angle': angle,
                          'x': x,
                          'y': y,
                          'dx': dx,
                          'dy': dy,
                          'speed': speed,
                          }])
            
                
        elif function == 'setSize':
            y_max = params['height']
            x_max = params['width']

        elif function == 'reboot':
            break




sock = eventlet.listen(('127.0.0.1', 9999))
wsgi.server(sock, hello_world)
