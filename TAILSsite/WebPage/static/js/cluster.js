/** A collection of functions which take in an object and add it to the tree in the proper location
 * determined by a conceptual clustering algorithm. Once the object is added to the tree, the drawing
 * is updated.
 */

var global_root = {};
var global_attributes = [];
var global_attribute_options = {};
var global_backup_text1 = ""; //This is the string of the nodes being added in the order they are added
var global_backup_text2 = "";
var global_backup_text3 = "";
var global_backup_text4 = "";
var global_event_counter = 0;

var getClusteredTree = function() {
	return global_root;
}

/**
 * This method adds objects to the tree using the the input radio buttons.
 */
var addObjects = function(num) {
	n = num || Math.floor($("input:text[name=numElements]").val());
	global_event_counter++;
	var attributes = global_attributes;
	global_backup_text4 = global_backup_text3;
	global_backup_text3 = global_backup_text2;
	global_backup_text2 = global_backup_text1;
	
	for(var i = 0; i < n; i++) {
		var obj = {};
		obj.attr = {};
		var current_string = "";
		
		for (key in attributes) {
			var field = 
				$('#'+attributes[key]+'s input[name='+attributes[key]+'Input]:checked').val() !== undefined ? 
				$('#'+attributes[key]+'s input[name='+attributes[key]+'Input]:checked') :
				$("input:text[name="+attributes[key]+"]");	
			obj.attr[attributes[key]] = {};
			obj.attr[attributes[key]][field.val().toLowerCase()] = 1;
			current_string += [field.val().toLowerCase()] + ",";
		}
		
		current_string = current_string.substring(0,current_string.length-1);
		global_backup_text1 += current_string + "!";
		addToTree(obj);
	}

	if(n > 0) {
		draw();
	}
}

/**
 * This method adds random objects based on the weights associated with each value near the radio buttons.
 */
var addRandomObjects = function(num) {
	global_event_counter++;
	var n = num || Math.floor($("input:text[name=numRandom]").val());
	var attributes = global_attributes;
	var attribute_options = global_attribute_options;
	
	weightedArrays = [];
	for (key in attributes) {
		weightedArrays[key] = [];
		for (index in attribute_options[attributes[key]]) {
			var attrVal = attribute_options[attributes[key]][index].toLowerCase();
			var weight = $("input:text[name="+ attrVal + "Weight]").val();
			for(var i = 0; i < weight; i++) {
				weightedArrays[key].push(attrVal);
			}
		}
	}
	//Saves previous array state in string format
	global_backup_text4 = global_backup_text3;
	global_backup_text3 = global_backup_text2;
	global_backup_text2 = global_backup_text1;
	for(var i = 0; i < n; i ++) {
		var obj = {};
		var current_string = "";
		obj.attr = {};
		for (key in attributes) {
			//var index = Math.floor(Math.random() * attribute_options[attributes[key]].length);
			var index = Math.floor(Math.random() * weightedArrays[key].length);
			
			obj.attr[attributes[key]] = {};
			obj.attr[attributes[key]][weightedArrays[key][index].toLowerCase()] = 1;
			current_string += weightedArrays[key][index].toLowerCase() + ",";
		}
		current_string = current_string.substring(0,current_string.length-1);
		//the ! is added to backup_text to help with parsing of it later
		global_backup_text1 += current_string + "!";
		addToTree(obj);
	}
	if(n > 0) {
		draw();
	}
}

/**
 * This function is utilized to add objects from a text form in the pattern of
 * "value1,value2,...,valueN!value1,value2,...,valueN!..." 
 * It calls addObjectFromText multiple times
 */
var addMultipleObjectsFromText = function(objects_in_text) {
	var objString = "";
	while ((objects_in_text.match(/!/g)||[]).length >= 1) { 
		objString = objects_in_text.substring(0, objects_in_text.indexOf("!"));
		objects_in_text = objects_in_text.substring(objects_in_text.indexOf("!")+1);
		addObjectFromText(objString);
	}
}

/**
 * This function adds a single object from text, in the form of value1,value2,...valueN.
 */
var addObjectFromText = function(objString) {
	var attributes = global_attributes;
	var attribute_options = global_attribute_options;
	var objectAttributeArray = "";
		
	objectAttributeArray = objString.split(",");
	
	var obj = {};
	var current_string = "";
	obj.attr = {};
	for (key in attributes) {
		obj.attr[attributes[key]] = {};
		obj.attr[attributes[key]][objectAttributeArray[key]] = 1;
	}
	addToTree(obj);
	draw();
}

var usingUndo = false;

/**
 * This method is utilized to undo the previousa action of the user.
 */
var undoLastStep = function(){
	if (global_event_counter <= 1) {
		global_root = {};
		draw();
		
		addToActionLog("Undone. Cannot undo further. \n");
		actionLogIndex++;
	} else if (global_backup_text2 == "") {
		//checks to see if it is possible to undo
		addToActionLog("Cannot undo further. \n");
		actionLogIndex++;
	} else {
		//Code to undo the last step. Strings are passed on accordingly to the next backup text variable
		addToActionLog("Undone. \n");
		actionLogIndex++;
		usingUndo = true;
		global_event_counter--;
		global_root = {};
		//global_backup_texts are meant to hold a string representation of the cluster to be used with
		// addMultipleObjectsFromText function in order to recreate the tree.
		global_backup_text1 = global_backup_text2;
		global_backup_text2 = global_backup_text3;
		global_backup_text3 = global_backup_text4;
		global_backup_text4 = "";
		addMultipleObjectsFromText(global_backup_text1);
		usingUndo = false;
	}
}


var addToTree = function(obj) {
	if(global_root.children === undefined) {
		global_root.children = [];
		addObjectToClass(global_root, obj);
		if (!usingUndo) {
			addToActionLog("Initialized \n");
			actionLogIndex++;
		}
	} else {
		addToBestNode(global_root, obj);
		if (!usingUndo) {
			actionLogIndex++;
		}
	}
}

var actionLogIndex = 0;

/**
 * This function is utilized to add text to the action log. 
 */
var addToActionLog = function(string) {
	$(actionLog).prepend("Action " + actionLogIndex + ")\t" + string);
}

var addToBestNode = function(root, obj, loopCheck) {
	if(loopCheck===undefined) { 
		loopCheck = 0;
	}

	var utilAndIndex = getMaxUtilityAndIndexOfChildren(root, obj, loopCheck);
	var maxIndex = utilAndIndex[1];
	var maxUtil = utilAndIndex[0];
		
	if(loopCheck===2 && typeof(maxIndex)==="object") {
		maxIndex = maxIndex[0];
	}
	
	if(typeof(maxIndex)==="object") {
		//Merge classes of maxIndex and almostMaxIndex to one class and adds new object
		if (!usingUndo) {
			addToActionLog("Merged \n");
		}
		var mergedClass = merge(maxIndex, root, obj);
		if(root.children.length === 1 && root.children[0].children !== undefined) {
			for(var i = 0; i < root.children[0].children.length; i++) {
				root.children[0].children[i].parent = root;
			}
			root.children = root.children[0].children;
			mergedClass = root;
			addToBestNode(root, obj, loopCheck+1);
		} else {
			addToBestNode(mergedClass.parent, obj, loopCheck);
		}
	} else if (obj !== null) {
		if (maxIndex === -1) {
			addObjectToClass(root, obj);
			if (!usingUndo) {
				addToActionLog("Added Node \n");
			}
	    /* If we're adding the object to a terminal node, turn that node into a class with 
	     * the two terminal nodes as its children
	     */
		} else if (root.children[maxIndex].children === undefined) {
			if (!usingUndo) {
				addToActionLog("Formed New Subtree \n");
			}
		    // Parse through each attribute type in this object
			for(key in obj.attr) {
				incrementOrAddAttributeToClass(root, obj, key);
			}
			var childObj = root.children.splice(maxIndex, 1)[0];
			var classNode = {children: [], parent: root};
			addObjectToClass(classNode, obj);
			addObjectToClass(classNode, childObj);
			root.children.push(classNode);
		} else {
			var splitUtil = getSplitUtility(root, root.children[maxIndex], maxIndex, obj);
			
			if(splitUtil > maxUtil){
				if (!usingUndo) {
					addToActionLog("Split \n");
				}
				split(root, root.children[maxIndex], maxIndex);
				addToBestNode(root, obj);
			} else {
				for(key in obj.attr) {
					incrementOrAddAttributeToClass(root, obj, key);
				}
				addToBestNode(root.children[maxIndex], obj);
			}
			
		}
	}
}

var addObjectToClass = function(classNode, obj) {
	classNode.children.push(obj);
	obj.parent = classNode;
	for(key in obj.attr) {
		incrementOrAddAttributeToClass(classNode, obj, key);
	}
}

var incrementOrAddAttributeToClass = function(classNode, obj, attrName) {
    // If we don't have an attribute element yet
	var attributeType = obj.attr[attrName];
	for(key in obj.attr[attrName]) {
		attributeType = key;
	}
	if (classNode.attr === undefined) {
		classNode.attr = {};
		classNode.attr[attrName] = {};
		classNode.attr[attrName][attributeType] = obj.attr[attrName][attributeType];
	// If we have an attribute element, but not this specific type of attribute
	} else if (classNode.attr[attrName] === undefined) {
		classNode.attr[attrName] = {};
		classNode.attr[attrName][attributeType] = obj.attr[attrName][attributeType];
	// If we have and element as well as this specific type of attribute
	} else {
		if (classNode.attr[attrName][attributeType] === undefined) {
			classNode.attr[attrName][attributeType] = obj.attr[attrName][attributeType];
		} else {
			classNode.attr[attrName][attributeType] += obj.attr[attrName][attributeType];
		}
	}
}
