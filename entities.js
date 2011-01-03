entities = {};

function Entity(id) {
    this.id = id;
    this.components = new Array();

    this.addComponent = function(component) {
	this.components.push(component);
    }
}

(function (Components, $, undefined) {

    Components.EC_Placeable = function(params) {
	this.componentName = 'EC_Placeable';
	this.parent = params['id'];
	this.x = params['x'];
	this.y = params['y'];
	this.z = params['z'];
	this.rotx = params['rotx'];
	this.roty = params['roty'];
	this.rotz = params['rotz'];
    }
    
    Components.EC_Mesh = function (params) {
	this.componentName = 'EC_Mesh';

	this.parent = params['id'];

	this.url = params['url']
	
	if (this.url) {
	    this.mesh = new GLGE.Collada();
	    this.mesh.setId(this.parent);
	    this.mesh.setDocument(this.url);
	    scene.addObject(this.mesh);
	}
    }
    
    Components.EC_DynamicComponent = function(params) {
	this.parent = params['id'];
	this.componentName = 'EC_DynamicComponent';
	this.code = params['code'];
    }
    
}(window.Components = window.Components || {}, jQuery));

function addEntity(params) {
    var id = params['id'];
    if (!entities[id])
	entities[id] = new Entity(id);
}

function addComponent(params) {
    id = params['id']

    var newComponent = params['component'];

    var component;

    if (Components[newComponent]) {
	//FIXME check that entity does not already have a mesh. Should
	//be done smarter
	for (i = 0; i < entities[id].components.length; i++) {
	    if (entities[id].components[i].componentName == newComponent)
		return;
	}
	
	// console.log(id + ' making new ' + newComponent + ' ' + params)
	component = new Components[newComponent](params);
	// console.log(id + ' adding ' + newComponent + ' ' + params)
	entities[id].addComponent(component);
	// console.log(id + ' setting attrs ' + newComponent + ' ' + params)
    }
}
    
function setAttr(params) {
    var id = params['id'];
    var component = params['component'];

    //console.log(id + ' SETTING ' + component + ' ' + JSON.stringify(params))
    var comp;

    for (comp in entities[id].components) {
	if (entities[id].components[comp].componentName == component) {
	    // console.log('FOUND corresponding component')

	    jQuery.extend(entities[id].components[comp], params);
	    if (component == 'EC_Placeable') {
		// console.log('IS PLACEABLE')
		for (child in scene.children) {
		    // console.log('CHILD: ' + child);
		    var collada = scene.children[child];
		    if (collada.getId() == id) {
			x = params['x']
			y = params['y']
			z = params['z']
			rotx = params['rotx']
			roty = params['roty']
			rotz = params['rotz']
			if (x)
			    collada.setLocX(x);
			if (y)
			    collada.setLocY(y);
			if (z)
			    collada.setLocZ(z);
			if (rotx)
			    collada.setRotX(rotx);
			if (roty)
			    collada.setRotX(roty);
			if (rotz)
			    collada.setRotX(rotz);
			
		    }
		}
	    }
	}
    }
}

function getAttr(params) {
    var id = params["id"];
    var component = params["component"];1
    var keys = params["keys"];
    
    var values = []
    for (comp in entities[id].components) {
	if (entities[id].components[comp].componentName == component) {
	    for (key in keys) {
		values.push(entities[id].components[comp][keys[key]]);
	    }
	}
	
    }
    return values
}


function loadScene(xml) {
    var entxml = (new DOMParser()).parseFromString(xml, "text/xml");
    var components = entxml.getElementsByTagName("component");

    var data = {};
    var id = entxml.getElementsByTagName("entity")[0].getAttribute("id");

    data[id] = {};

    for (c = 0; c < components.length; c++) {
	var component = components[c].getAttribute("type")
	data[id][component] = {}
	var attributes = components[c].getElementsByTagName("attribute");
	for (a = 0; a < attributes.length; a++) {
            var name = attributes[a].getAttribute("name");
	    var value = attributes[a].getAttribute("value");
	    data[id][component][name] = value
	}
    }

    if (!entities[id]) {
	addEntity({id: id});
    }
    
    for (component in data[id]) {

	switch(component) {
	case "EC_Placeable":
	    // FIXME What is the transform?!
	    var transform = data[id][component]['Transform'].split(',');

	    addComponent({id: id,
			  component: component,
			  x: transform[0], 
			  y: transform[1], 
			  z: transform[2], 
			  rotx: transform[3], 
			  roty: transform[4], 
			  rotz: transform[5]});
	break
	    
	}
    }
}



ent_data = '<scene> <entity id="-1958704278">  <component type="EC_Placeable" sync="0">   <attribute value="0,0,0,0,0,0,1,1,1" name="Transform"/>  </component>  <component type="EC_Mesh" sync="0">   <attribute value="0,0,-0.856287,90,1.70755e-06,-90,1,1,1" name="Transform"/>   <attribute value="" name="Mesh ref"/>   <attribute value="" name="Skeleton ref"/>   <attribute value="" name="Mesh materials"/>   <attribute value="0" name="Draw distance"/>   <attribute value="true" name="Cast shadows"/>  </component>  <component type="EC_AnimationController" sync="0">   <attribute value="" name="Animation state"/>  </component> </entity></scene>'