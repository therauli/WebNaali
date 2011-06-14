/* Entity stuff is here
   TODO:
   * Get camera to better position
*/

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
	console.log(params)
	this.transform = params['Transform']
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

function removeEntity(params) {
    var id = params['id'];
    for (c = 0; c < scene.children.length; c++) {
	if (scene.children[c].getId() == id) {
	    scene.children.splice(c, 1);
	    break;
	}
    }
    delete entities[id];
}

function addComponent(params) {
    id = params['id']

    var newComponent = params['component'];

    var component;


    // WS does not have any fancy sync state stuff so if we get an
    // addcomponent message for an entity that hasn't been created yet
    // we'll just add a new entity. This is not the way to go.
    if (!entities[id])
	addEntity({id: id})

    if (Components[newComponent]) {
	//FIXME check that entity does not already have a mesh. Should
	//be done smarter
	for (i = 0; i < entities[id].components.length; i++) {
	    if (entities[id].components[i].componentName == newComponent) {
		return;
	    }
	}
	
	console.log(id + ' making new ' + newComponent + ' ' + params)
	component = new Components[newComponent](params);
	console.log(id + ' adding ' + newComponent + ' ' + params)
	entities[id].addComponent(component);
	console.log(id + ' setting attrs ' + newComponent + ' ' + params)
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

	    //Joins componenst. A bit silly... (this comment came
	    //second in the World's most useless comments in the world
	    //competition of 2011
	    
	    jQuery.extend(entities[id].components[comp], params);
	    if (component == 'EC_Placeable') {
		// console.log('IS PLACEABLE')
		for (child in scene.children) {
		    var collada = scene.children[child];
		    if (collada.getId() == id) {
			var transform = params['Transform'] || [0,0,0,0,0,0];
			x = transform[0];
			y = transform[1];
			z = transform[2];
			rotx = transform[3] * Math.PI / 180;
			roty = transform[5] * Math.PI / 180;
			rotz = transform[4] * Math.PI / 180;
			if (x)
			    collada.setLocX(x);
			if (y)
			    collada.setLocY(y);
			if (z)
			    collada.setLocZ(z);
			if (rotx)
			    collada.setRotX(rotx);
			if (roty)
			    collada.setRotY(roty);
			if (rotz)
			    collada.setRotZ(rotz);

			if (id == myid) {
			    // sync Camera
			    camera.setLoc(x, y + 2, z);
			    camera.setRot(rotx, roty - Math.PI / 2, rotz);
			}
		    }
		}
	    }
	}
    }
}

function getAttr(params) {
    var id = params["id"];
    var component = params["component"];
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

function loadScene(params) {
    var xmlstring = params['xml'];
    var scenexml = (new DOMParser()).parseFromString(xmlstring, "text/xml");

    var data = {};

    var loadentities = scenexml.getElementsByTagName("entity")

    for (e = 0; e < loadentities.length; e++) {
	var entity = loadentities[e];

	var id = entity.getAttribute("id");
	data[id] = {};
	
	components = entity.getElementsByTagName("component");

	for (c = 0; c < components.length; c++) {
	    var component = components[c].getAttribute("type")

	    data[id][component] = {};
	    var attributes = components[c].getElementsByTagName("attribute");

	    for (a = 0; a < attributes.length; a++) {
		var attribute = attributes[a];

		var name = attribute.getAttribute("name");
		var value = attribute.getAttribute("value");
		data[id][component][name] = value
		
	    }
	}
    }

    //Add/update components
    // Just use EC_Placeable and EC_MESH for time being
    for (id in data) {
	//add entity (if not in scene)
	if (!entities[id]) {
	    addEntity({id: id});
	} else {
	    console.log('ERROR: ' + id + ' already in scene!');
	}

	for (component in data[id]) {
	    console.log(component)
	    if (component == 'EC_Placeable') {
		console.log('PLACE');
		addComponent({id: id,
			      component: component,
			      transform: data[id][component]['Transform'].split(',')});
	    } else if (component == 'EC_Mesh') {
		console.log('MESH')
		addComponent({id: id,
			      component: component,
			      url: data[id][component]['Mesh ref']});
	    } 
	    
	}
    }
}

ent_data = '<scene> <entity id="-1958704278">  <component type="EC_Placeable" sync="0">   <attribute value="0,0,0,0,0,0,1,1,1" name="Transform"/>  </component>  <component type="EC_Mesh" sync="0">   <attribute value="0,0,-0.856287,90,1.70755e-06,-90,1,1,1" name="Transform"/>   <attribute value="" name="Mesh ref"/>   <attribute value="" name="Skeleton ref"/>   <attribute value="" name="Mesh materials"/>   <attribute value="0" name="Draw distance"/>   <attribute value="true" name="Cast shadows"/>  </component>  <component type="EC_AnimationController" sync="0">   <attribute value="" name="Animation state"/>  </component> </entity></scene>'

data2= '<!DOCTYPE Scene><scene> <entity id=\"1\">  <component type=\"EC_Name\" sync=\"1\">   <attribute value=\"Instructions\" name=\"name\"/>   <attribute value=\"\" name=\"description\"/>   <attribute value=\"false\" name=\"user-defined\"/>  </component>  <component type=\"EC_Script\" sync=\"1\">   <attribute value=\"\" name=\"Type\"/>   <attribute value=\"true\" name=\"Run on load\"/>   <attribute value=\"local://instructions.js\" name=\"Script ref\"/>  </component> </entity> <entity id=\"3\">  <component type=\"EC_Mesh\" sync=\"1\">   <attribute value=\"0,0,0,90,0,180,0.14,0.2,0.14\" name=\"Transform\"/>   <attribute value=\"file://WoodPallet.mesh\" name=\"Mesh ref\"/>   <attribute value=\"\" name=\"Skeleton ref\"/>   <attribute value=\"\" name=\"Mesh materials\"/>   <attribute value=\"0\" name=\"Draw distance\"/>   <attribute value=\"true\" name=\"Cast shadows\"/>  </component>  <component type=\"EC_Name\" sync=\"1\">   <attribute value=\"Floor\" name=\"name\"/>   <attribute value=\"\" name=\"description\"/>   <attribute value=\"false\" name=\"user-defined\"/>  </component>  <component type=\"EC_Placeable\" sync=\"1\">   <attribute value=\"0 0 0\" name=\"Position\"/>   <attribute value=\"1 1 1\" name=\"Scale\"/>   <attribute value=\"0,0,0,0,0,0,100,1,100\" name=\"Transform\"/>   <attribute value=\"false\" name=\"Show bounding box\"/>   <attribute value=\"true\" name=\"Visible\"/>  </component>  <component type=\"EC_RigidBody\" sync=\"1\">   <attribute value=\"0\" name=\"Mass\"/>   <attribute value=\"0\" name=\"Shape type\"/>   <attribute value=\"1 1 0.300000012\" name=\"Size\"/>   <attribute value=\"\" name=\"Collision mesh ref\"/>   <attribute value=\"0.5\" name=\"Friction\"/>   <attribute value=\"0\" name=\"Restitution\"/>   <attribute value=\"0\" name=\"Linear damping\"/>   <attribute value=\"0\" name=\"Angular damping\"/>   <attribute value=\"1 1 1\" name=\"Linear factor\"/>   <attribute value=\"1 1 1\" name=\"Angular factor\"/>   <attribute value=\"false\" name=\"Phantom\"/>   <attribute value=\"true\" name=\"Draw Debug\"/>   <attribute value=\"0 0 0\" name=\"Linear velocity\"/>   <attribute value=\"0 0 0\" name=\"Angular velocity\"/>  </component> </entity> <entity id=\"4\">  <component type=\"EC_Mesh\" sync=\"1\">   <attribute value=\"0,0,0,90,0,180,1,1,1\" name=\"Transform\"/>   <attribute value=\"file://fish.mesh\" name=\"Mesh ref\"/>   <attribute value=\"\" name=\"Skeleton ref\"/>   <attribute value=\"\" name=\"Mesh materials\"/>   <attribute value=\"0\" name=\"Draw distance\"/>   <attribute value=\"true\" name=\"Cast shadows\"/>  </component>  <component type=\"EC_Name\" sync=\"1\">   <attribute value=\"Fish\" name=\"name\"/>   <attribute value=\"\" name=\"description\"/>   <attribute value=\"false\" name=\"user-defined\"/>  </component>  <component type=\"EC_Placeable\" sync=\"1\">   <attribute value=\"0 0 0\" name=\"Position\"/>   <attribute value=\"1 1 1\" name=\"Scale\"/>   <attribute value=\"1.38655,5.28352,0.407235,-107.232,-24.9349,-35.6389,1,1,1\" name=\"Transform\"/>   <attribute value=\"false\" name=\"Show bounding box\"/>   <attribute value=\"true\" name=\"Visible\"/>  </component>  <component type=\"EC_RigidBody\" sync=\"1\">   <attribute value=\"100\" name=\"Mass\"/>   <attribute value=\"6\" name=\"Shape type\"/>   <attribute value=\"1 1 1\" name=\"Size\"/>   <attribute value=\"file://fish.mesh\" name=\"Collision mesh ref\"/>   <attribute value=\"0.5\" name=\"Friction\"/>   <attribute value=\"0\" name=\"Restitution\"/>   <attribute value=\"0\" name=\"Linear damping\"/>   <attribute value=\"0\" name=\"Angular damping\"/>   <attribute value=\"1 1 1\" name=\"Linear factor\"/>   <attribute value=\"1 1 1\" name=\"Angular factor\"/>   <attribute value=\"false\" name=\"Phantom\"/>   <attribute value=\"true\" name=\"Draw Debug\"/>   <attribute value=\"4.84698285e-005 -5.49564629e-006 -7.59959221e-007\" name=\"Linear velocity\"/>   <attribute value=\"-0.000233365936 -3.17672275e-005 -0.000288766052\" name=\"Angular velocity\"/>  </component> </entity> <entity id=\"5\">  <component type=\"EC_Script\" sync=\"1\">   <attribute value=\"js\" name=\"Type\"/>   <attribute value=\"true\" name=\"Run on load\"/>   <attribute value=\"local://avatarapplication.js\" name=\"Script ref\"/>  </component>  <component type=\"EC_Name\" sync=\"1\">   <attribute value=\"AvatarScript\" name=\"name\"/>   <attribute value=\"\" name=\"description\"/>   <attribute value=\"false\" name=\"user-defined\"/>  </component>  <component type=\"EC_InputMapper\" sync=\"1\">   <attribute value=\"EC_InputMapper\" name=\"Input context name\"/>   <attribute value=\"102\" name=\"Input context priority\"/>   <attribute value=\"false\" name=\"Take keyboard events over Qt\"/>   <attribute value=\"false\" name=\"Take mouse events over Qt\"/>   <attribute value=\"\" name=\"Mappings\"/>   <attribute value=\"1\" name=\"Action execution type\"/>   <attribute value=\"1\" name=\"Key modifiers enable\"/>   <attribute value=\"true\" name=\"Enable actions\"/>   <attribute value=\"true\" name=\"Trigger on keyrepeats\"/>  </component> </entity></scene>'