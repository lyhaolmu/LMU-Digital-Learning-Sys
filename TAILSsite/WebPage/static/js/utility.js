/* This function generates the categorical utility of adding a new object to the tree
 * in relation to a specific node. 
 * The equation it uses to generate the categorical utility is:
 *    ((expected number of attribute values that can be correctly guessed) 
 *    - (expected number of attribute values that can be correctly guessed without any categorical knowledge))
 *    /(number of classes at this level)
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var getCategoricalUtility = function(referenceNode, childNumber, obj){	
	var expectedRandomGuesses = getExpectedNumberOfAttributeToGuess(referenceNode, -1, childNumber, obj);
	
	var sumSubClassGuess = 0;
	for(var i = 0; i < referenceNode.children.length; i++) {
		sumSubClassGuess += getExpectedNumberOfAttributeToGuess(referenceNode.children[i], i, childNumber, obj);
	}
	
	if(childNumber == -1) {
		sumSubClassGuess += (obj === null) ? 0 : Object.size(obj.attr);
		//alert("("+sumSubClassGuess + " - " + expectedRandomGuesses + ")/" + (referenceNode.children.length + 1));
		return (sumSubClassGuess - expectedRandomGuesses)/(referenceNode.children.length + 1);
	} else {
		//alert("("+sumSubClassGuess + " - " + expectedRandomGuesses + ")/" + (referenceNode.children.length));
		return (sumSubClassGuess - expectedRandomGuesses)/referenceNode.children.length;
	}
}

var getCategoricalUtilityOfMerge = function(referenceNode, maxIndex, almostMaxIndex, obj) {
	var expectedRandomGuesses = getExpectedNumberOfAttributeToGuess(referenceNode, -1, -1, obj);

	var sumNonMergedGuess = 0;
	for(var i = 0; i < referenceNode.children.length; i++) {
		if(i !== maxIndex && i !== almostMaxIndex) {
			sumNonMergedGuess += getExpectedNumberOfAttributeToGuess(referenceNode.children[i], i, maxIndex, obj);
		}
	}
	
	sumNonMergedGuess += getExpectedGuessForMergedClasses(referenceNode.children[maxIndex], referenceNode.children[almostMaxIndex], obj);
	
	return (sumNonMergedGuess - expectedRandomGuesses)/(referenceNode.children.length - 1);
}

var getExpectedGuessForMergedClasses = function(node1, node2, obj) {
	var mergedClass = {};
	for(key in node1.attr) {
		incrementOrAddAttributeToClass(mergedClass, node1, key);
	}
	for(key in node2.attr) {
		incrementOrAddAttributeToClass(mergedClass, node2, key);
	}
	
	return getExpectedNumberOfAttributeToGuess(mergedClass, -2, -2, obj);
}

var getExpectedNumberOfAttributeToGuess = function(node, nodeIndex, nodeIndexToAddTo, obj) {
	var expectedNumberToGuess = 0;
	for(attrName in node.attr) {
		var maxNumberOfAttrType = 0;
		for(attrType in node.attr[attrName]) {
			var numberInClass = node.attr[attrName][attrType];
			if((nodeIndex == -1 || nodeIndex == nodeIndexToAddTo) && obj !== null && obj.attr[attrName][attrType] == 1) {
				numberInClass++;
			}
			if (numberInClass > maxNumberOfAttrType) {
				maxNumberOfAttrType = numberInClass;
			}
		}
		expectedNumberToGuess += maxNumberOfAttrType;
	}
	return expectedNumberToGuess;
}

var getMaxUtilityAndIndexOfChildren  = function(root, obj, loopCheck){
	if(loopCheck===undefined) {
		loopCheck=0;
	}
	
	var maxUtil = getCategoricalUtility(root, 0, obj);
	var almostMaxUtil = null;
	var maxIndex = 0;
	var almostMaxIndex = null;
	if(root.children.length > 1) {
		almostMaxUtil = getCategoricalUtility(root, 1, obj);
		almostMaxIndex = 1;
		if(almostMaxUtil > maxUtil) {
			almostMaxUtil = (maxUtil += almostMaxUtil -= maxUtil) - almostMaxUtil;
			almostMaxIndex = 0;
			maxIndex = 1;
		}
	}
	for(var i = 2; i < root.children.length; i++) {
		var utility = getCategoricalUtility(root, i, obj);
		if(utility > maxUtil) {
			almostMaxUtil = maxUtil;
			almostMaxIndex = maxIndex;
			maxUtil = utility;
			maxIndex = i;
		} else if (utility > almostMaxUtil) {
			almostMaxUtil = utility;
			almostMaxIndex = i;
		}
	}
	
	/* If the categorical utility is better when making the object its own new category,
	 * add it to the tree in this way
	 */
	var utility = getCategoricalUtility(root, -1, obj);
	if(loopCheck !== 2) {
		if(utility >= maxUtil) {
			almostMaxUtil = maxUtil;
			almostMaxIndex = maxIndex;
			maxUtil = utility;
			maxIndex = -1;
		} else if (almostMaxUtil === null || utility >= almostMaxUtil) {
			almostMaxUtil = utility;
			almostMaxIndex = -1;
		} else {
			//Test utility of merge of top 2 utility classes
			utility = getCategoricalUtilityOfMerge(root, maxIndex, almostMaxIndex, obj);
			if(utility >= maxUtil) {
				maxUtil = utility;
				maxIndex = [maxIndex, almostMaxIndex];
			}
		}
	} else {
		if (utility >= maxUtil) {
			almostMaxUtil = maxUtil;
			almostMaxIndex = maxIndex;
			maxUtil = utility;
			maxIndex = -1;
		}
	}
	
	if(root.children.length === 1) {
		maxIndex = -1;
	} else if(typeof(maxIndex) === "object" && root.children.length === 2 && root.children[0].children === undefined && root.children[1].children === undefined) {
		maxIndex = -1;
	}
	
	return [maxUtil, maxIndex];
}

var getSplitUtility = function(root, nodeToSplit, splitIndex, obj) {
	var splitChildren = nodeToSplit.children;
	root.children.splice(splitIndex, 1);
	
	var originalLength = root.children.length;
	for(var i = 0; i < splitChildren.length; i++){
		root.children.push(splitChildren[i]);
		splitChildren[i].parent = root;
	}
	
	var utilAndIndex = getMaxUtilityAndIndexOfChildren(root, obj);
	var splitUtility = utilAndIndex[0];
	
	root.children.splice(originalLength, splitChildren.length);
	for(var i = 0; i < splitChildren.length; i++){
		splitChildren[i].parent = nodeToSplit;
	}
	
	root.children.splice(splitIndex, 0, nodeToSplit);
	
	return splitUtility;
}






