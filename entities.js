entities = {};

function Entity(id) {
    this.id = id;
    this.components = new Array();

    this.addComponent = function(component) {
	this.components.push(component);
    }
}

(function (Components, $, undefined) {
    Components.EC_Placeable = function(parent, params) {

	this.componentName = 'EC_Placeable';
	this.parent = parent;
	this.x = params['x'];
	this.y = params['y'];
	this.z = params['z'];
	this.rotx = params['rotx'];
	this.roty = params['roty'];
	this.rotz = params['rotz'];
    }
    
    Components.EC_Mesh = function (parent, params) {
	this.componentName = 'EC_Mesh';
	this.parent = parent;

	this.url = params['url']

	if (this.url) {
	    this.mesh = new GLGE.Collada();
	    this.mesh.setId(parent);
	    this.mesh.setDocument(this.url);
	    scene.addObject(this.mesh);
	}
    }
    
    Components.EC_DynamicComponent = function(parent, code) {
	this.pareng = parent;
	this.componentName = 'EC_DynamicComponent';
	this.code = code;
    }
    
}(window.Components = window.Components || {}, jQuery));

function addEntity(id) {
    entities[id] = new Entity(id);
}

function addComponent(id, newComponent, params) {
    var component;
		
    if (Components[newComponent]) {
	//console.log(id + ' making new ' + newComponent + ' ' + params)
	component = new Components[newComponent](id, eval('(' + params + ')'));
	//console.log(id + ' adding ' + newComponent + ' ' + params)
	entities[id].addComponent(component);
	//console.log(id + ' setting attrs ' + newComponent + ' ' + params)
	setAttr(id, newComponent, params);
    }
}
    
function setAttr(id, component, data) {
    // console.log(id + ' SETTING ' + component + ' ' + data)
    var comp;
    var values;
    for (comp in entities[id].components) {
	if (entities[id].components[comp].componentName == component) {
	    // console.log('FOUND corresponding component')
	    values = eval('(' + data + ')')
	    jQuery.extend(entities[id].components[comp], values);

	    if (component == 'EC_Placeable') {
		// console.log('IS PLACEABLE')
		for (child in scene.children) {
		    // console.log('CHILD: ' + child);
		    var collada = scene.children[child];
		    if (collada.getId() == id) {
			// console.log('Found corresponding id')
			x = values['x']
			y = values['y']
			z = values['z']
			if (x) collada.setLocX(x);
			if (y) collada.setLocY(y);
			if (z) collada.setLocZ(z);
			   
		    }
		}
		
	    }
	}
    }
}

function getAttr(id, component, keys) {
    var comp;
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
