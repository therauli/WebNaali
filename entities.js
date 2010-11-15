entities = {};

function Entity(id) {
    this.id = id;
    this.components = new Array();

    this.addComponent = function(component) {
	this.components.push(component);
    }
}

(function (Components, $, undefined) {
    Components.EC_Placeable = function(x, y, z, rotx, roty, rotz) {
	this.componentName = 'EC_Placeable';
	this.x = x;
	this.y = y;
	this.z = z;
	this.rotx = rotx;
	this.roty = roty;
	this.rotz = rotz;
    }
    
    Components.EC_Mesh = function (source) {
	this.componentName = 'EC_Mesh';
	this.mesh = new GLGE.Collada(source)
	scene.addChildren(this.mesh)
    }
    
    Components.EC_DynamicComponent = function(code) {
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
	component = new Components[newComponent];
	entities[id].addComponent(component);
	setAttr(id, newComponent, params);
    }
}
    
function setAttr(id, component, data) {
    var comp;
    for (comp in entities[id].components) {
	if (entities[id].components[comp].componentName == component) {
	    jQuery.extend(entities[id].components[comp], eval('(' + data + ')'));
	}
    }
}
