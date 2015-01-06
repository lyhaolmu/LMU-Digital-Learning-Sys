var traverseTreeAndAddShape = function(paper, root, childNumber) {
	//Offsets used to adequately display hover text
	var	leftOffset = 10; 
		topOffset = 225;
	if(root.parent === undefined) {
		root.shape = drawShape(paper, root, childNumber)
		root.spaceToUse = 1000;
		root.shape.node.parent = root;
		root.shape.node.onmouseover = function() {
					//This is the code for the message to appear when mouse hovers over a shape
					if (this.parent.attr === undefined) {
						alert("Root");
					} else {
						//This creates the text that will appear on the message screen
						var str = "",
							lineCounter = 0;
						for(property in this.parent.attr) {
							for(key in this.parent.attr[property]) {
								str += key + ": " + this.parent.attr[property][key] + "\n";
								lineCounter++;
							}
							str += "\n";
							lineCounter++;
						}
				    //This is what causes the message to appear in a box of appropriate size
					var toLeft=event.clientX - 225,
						toTop=event.clientY + 10,
						lineHeight = 18; //Height of every line approximately. Used to provide ample space
					$(hoverBox).css('opacity', 1);
					$(hoverBox).css('left', toLeft + 'px');
					$(hoverBox).css('top', toTop + 'px');
					$(hoverBox).css('height', lineCounter*lineHeight + 'px');
					$(hoverBox).val(str);
					}
		}
		root.shape.node.onmouseout = function() {
			//Code for hiding the text after user has moved mouse pointer
			$(hoverBox).css('opacity', 0);
			$(hoverBox).css('left', 0 + 'px');
			$(hoverBox).css('top', 0 + 'px');
			$(hoverBox).css('height', 1 + 'px');
		}
	} else {
		//Get bounding box of parent object
		var box = root.parent.shape.getBBox();
		
		//Get center bottom of parent object 
		var parentXLoc = box.x + box.width/2.0;
		var parentYLoc = box.y + box.height;
		//Calculate the y-coordinate of following child objects
		root.levelHeight = parentYLoc + 100;
		root.numSiblings = root.parent.children.length;
		root.offsetX = parentXLoc - root.parent.spaceToUse/2;
		
		//Find separation between child objects
		root.spaceToUse = root.parent.spaceToUse/(root.numSiblings);
		
		root.shape = drawShape(paper, root, childNumber);
		
		root.shape.node.parent = root;
		// When the user clicks on a node or a class, the attributes of that node or class are alerted.
		root.shape.node.onmouseover = function() {
			var totalInTree = 0;		
			//Next segment is used in order to create  the string to be shown when hovering over a shape
			for(property in global_root.attr) {
				for(key in global_root.attr[property]) {
					totalInTree += global_root.attr[property][key];
				}
				break;
			}
			//Gathers information to be shown in hover text box
			var totalInClass = 0;
			for(property in this.parent.attr) {
				if(typeof(this.parent.attr[property]) === "object") {
					for(key in this.parent.attr[property]) {
						totalInClass +=this.parent.attr[property][key];
					}
					str += "\n";
				} else {
					totalInClass += this.parent.attr[property];
				}
				break;
			}
			
			var str = "",
				lineCounter = 0;
			for(property in this.parent.attr) {
				if(typeof(this.parent.attr[property]) === "object") {
					str += property + "\n"; // MODIFY THIS FOR DATA
					for(key in this.parent.attr[property]) {
						str += key + ": " + this.parent.attr[property][key] + "    \n";
						str += "P(" + property + "=" + key + "|This Class):" + 
							Math.floor(this.parent.attr[property][key]/totalInClass * 10000)/100 + "%\n";
						lineCounter++;
					}
					str += "\n";
					lineCounter++;
				} else {
					str += property + ": " + this.parent.attr[property] + "    \n";
					str += "P(" + property + "=" + key + "|This Class):" + 
						Math.floor(this.parent.attr[property]/totalInClass * 10000)/100 + "%\n";
					lineCounter++;
				}
			}
			str += "\n\nPercent of entire tree: " + Math.floor(totalInClass/totalInTree*10000)/100 + "%\n";
			lineCounter += 3;
			//Code for making informational text appear
			var toLeft=event.clientX - 225,
				toTop=event.clientY + 10,
				lineHeight = 25; //Height of every line approximately. Used to provide ample space;
			$(hoverBox).css('opacity', 1);
			$(hoverBox).css('left', toLeft + 'px');
			$(hoverBox).css('top', toTop + 'px');
			$(hoverBox).css('height', lineCounter*lineHeight + 'px');
			$(hoverBox).val(str);
		};
		//Code to remove hover message
		root.shape.node.onmouseout = function() {
			$(hoverBox).css('opacity', 0);
			$(hoverBox).css('left', 0 + 'px');
			$(hoverBox).css('top', 0 + 'px');
			$(hoverBox).css('height', 1 + 'px');
			
		}
		drawLine(paper, parentXLoc, parentYLoc, root.offsetX + root.spaceToUse*(childNumber+0.5), root.levelHeight - 5);
	}
	if(root.children !== undefined) {
		for(var i = 0; i < root.children.length; i++) {
			traverseTreeAndAddShape(paper, root.children[i], i);
		}
	}
}