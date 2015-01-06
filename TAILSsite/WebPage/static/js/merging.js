var merge = function(maxIndex, root, obj) {
	var mergedClass = {};
	var almostMaxIndex = maxIndex[1];
	var maxIndex = maxIndex[0];
	if(root.children[maxIndex].children === undefined) {
		if(root.children[almostMaxIndex].children === undefined) {
			// Parse through each attribute type in this object

			var childObj1 = root.children.splice(maxIndex, 1)[0];
			var childObj2 = root.children.splice(almostMaxIndex + ((maxIndex > almostMaxIndex) ? 0 : -1), 1)[0];

			var classNode = {children: [], parent: root};

			addObjectToClass(classNode, childObj1);
			addObjectToClass(classNode, childObj2);
			root.children.push(classNode);
			
			/*if(obj !== null) {
				for(key in obj.attr) {
					incrementOrAddAttributeToClass(root, obj, key);
				}
				addToBestNode(classNode, obj);
			}*/
			mergedClass = classNode;
		} else {
			var childObj = root.children.splice(maxIndex, 1)[0];
			almostMaxIndex += ((maxIndex > almostMaxIndex) ? 0 : -1);
			addObjectToClass(root.children[almostMaxIndex], childObj);
			
			/*if(obj !== null) {
				for(key in obj.attr) {
					incrementOrAddAttributeToClass(root, obj, key);
				}
				addToBestNode(root.children[almostMaxIndex], obj);
			}*/
			mergedClass = root.children[almostMaxIndex];
		}
	} else if (root.children[almostMaxIndex].children === undefined) {
		var childObj = root.children.splice(almostMaxIndex, 1)[0];
		maxIndex += ((almostMaxIndex > maxIndex) ? 0 : -1);
		addObjectToClass(root.children[maxIndex], childObj);
		
		/*if(obj !== null) {
			for(key in obj.attr) {
				incrementOrAddAttributeToClass(root, obj, key);
			}
			addToBestNode(root.children[maxIndex], obj);
		}*/
		mergedClass=root.children[maxIndex];
	} else {
		var removedClass = root.children.splice(almostMaxIndex, 1)[0];
		maxIndex += ((almostMaxIndex > maxIndex) ? 0 : -1);
		for(var i = 0; i < removedClass.children.length; i++) {
			addObjectToClass(root.children[maxIndex], removedClass.children[i]);
		}
		
		/*if(obj !== null) {
			for(key in obj.attr) {
				incrementOrAddAttributeToClass(root, obj, key);
			}
			addToBestNode(root.children[maxIndex], obj);
		}*/
		mergedClass=root.children[maxIndex];
	}
	return mergedClass;
}

var split = function(root, nodeToSplit, splitIndex){
	var splitChildren = nodeToSplit.children;
	root.children.splice(splitIndex, 1);
	
	var originalLength = root.children.length;
	for(var i = 0; i < splitChildren.length; i++){
		root.children.push(splitChildren[i]);
		splitChildren[i].parent = root;
	}
}