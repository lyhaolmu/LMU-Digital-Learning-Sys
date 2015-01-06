var paperHandle = null;

var drawShape = function(paper, root, childNumber){
	var shapeSideLength = 10;
	
	//var color = findDominantColor(root);
	var color = findAverageColor(root);
	var shape = findDominantShape(root);
	var size = findDominantSize(root);
    if(root.parent === undefined){
        return drawRepresentation(
        	paper, 
        	500, 50, 
        	shapeSideLength,shapeSideLength, 
        	color, shape, size
        );
    }
    else {
        return drawRepresentation(
        	paper, 
        	root.offsetX + root.spaceToUse*(childNumber+0.5), 
        	root.levelHeight, shapeSideLength,shapeSideLength, 
        	color, shape, size
        );
    }
}

var findDominantColor = function(obj) {
	//console.log(obj);
	var colorAttr = null;
	var maxValue = 0;
	var maxColor;
	for(key in obj.attr) {
		if(key == 'color') {
			colorAttr = obj.attr[key];
		}
	}
	
	if(colorAttr == null) {
		return 'black';  //default if no color attribute given
	} else {
		for(color in colorAttr) {
			if(colorAttr[color] > maxValue) {
				maxValue = colorAttr[color];
				maxColor = color;
			}
		}
		return maxColor;
	}
}

var findAverageColor = function(obj) {
	//console.log(obj);
	var colorAttr = null;
	var bTot = 0;
	var rTot = 0;
	var gTot = 0;
	var b = 0;
	var r = 0;
	var g = 0;
	var numColors = 0;
	
	
	for(key in obj.attr) {
		if(key == 'color') {
			colorAttr = obj.attr[key];
		}
	}
	
	if(colorAttr == null) {
		return 'black';  //default if no color attribute given
	} else {
		for(color in colorAttr) {
			numColors += colorAttr[color];
			if(color == "blue") {
				r = 0; g = 0; b = 255;
			} else if(color == "red") {
				r = 255; g = 0; b = 0;
			} else if(color == "green") {
				r = 0; g = 255; b = 0;
			} else if(color == "yellow") {
				r = 255; g = 255; b = 0;
			} else if(color == "orange") {
				r = 255; g = 165; b = 0;
			} else {
				r = 0; g = 0; b = 0;
			}
			rTot += r * colorAttr[color];
			gTot += g * colorAttr[color];
			bTot += b * colorAttr[color];
		}
		rTot = Math.floor(rTot/numColors);
		gTot = Math.floor(gTot/numColors);
		bTot = Math.floor(bTot/numColors);

		return "rgb("+rTot+", "+gTot+", "+bTot+")";
	}
}

var findDominantShape = function(obj) {
	var shapeAttr = null;
	var maxValue = 0;
	var maxShape;
	for(key in obj.attr) {
		if(key == 'shape') {
			shapeAttr = obj.attr[key];
		}
	}
	
	if(shapeAttr == null) {
		return 'square';  //default if no shape attribute given
	} else {
		for(shape in shapeAttr) {
			if(shapeAttr[shape] > maxValue) {
				maxValue = shapeAttr[shape];
				maxShape = shape;
			}
		}
		return maxShape;
	}
}

var findDominantSize = function(obj) {
	var sizeAttr = null;
	var maxValue = 0;
	var maxSize;
	for(key in obj.attr) {
		if(key == 'size') {
			sizeAttr = obj.attr[key];
		} else { 
			var defaultObject = {size:"small"};
			sizeAttr = defaultObject;
		}
	}
	for(size in sizeAttr) {
		if(sizeAttr[size] > maxValue) {
			maxValue = sizeAttr[size];
			maxSize = size;
		}
	}
	return maxSize;	
}

var drawLine = function(paper,x1,y1,x2,y2) {
	//Draws a line from cordinates (x1,y1) to (x2,y2)
	var line = paper.path("M" + x1 + "," + y1 + "L" + x2 + "," + y2);
	return line;
}

var drawRepresentation = function(paper,x,y,width,height,color,shape) {
	var scaleDifference = 0.3;
	if(size == 'small') {
		height = height * (1-scaleDifference);
		width = width * (1-scaleDifference);
	} else if (size == 'large') {
		height = height * (1+scaleDifference);
		width = width * (1+scaleDifference);
	}
	
	if(shape == 'circle'){
		return drawCircle(paper,x,y,height/2,color);
	} else if(shape == 'rectangle'){
		return drawRectangle(paper,x,y,width/1.5,height*1.2,color);
	} else if(shape == 'triangle') {
		return drawTriangle(paper,x,y,width,height,color);
	} else if(shape == 'square'){
		return drawSquare(paper,x,y,height,color);
	} else {
		//Default if not found to square
		return drawSquare(paper,x,y,height,color);
	}
}

var drawTriangle = function(paper,x,y,width,height,color) {
	var tri = paper.path("M"+x+","+(y*1.0-height*0.5)+
						 "L"+(x*1.0-width*0.5)+","+(y*1.0+height*0.5)+
						 "L"+(x*1.0+width*0.5)+","+(y*1.0+height*0.5)+						 
						 "L"+x+","+(y*1.0-height*0.5)					 
						 );
	tri.attr("fill", color);
	return tri;
}

var drawRectangle = function(paper,x,y,width,height,color) {
	var rect = paper.rect(x-width/2,y-height/2,width,height);
	rect.attr("fill", color);
	return rect;
}

var drawSquare = function(paper,x,y,side,color) {
	//Draws a square centered at (x,y) with given side length
	var square = paper.rect(x-side/2,y-side/2,side,side);
	square.attr("fill", color);
	return square;
}


var drawCircle = function(paper, x, y, r, color) {
	//Draws a circle centered at (x,y) with radius r
	var circle = paper.circle(x,y,r);
	circle.attr("fill", color);
	circle.attr("stroke", "black");
	return circle;
}

var draw = function () {
	//Clears paper if anything is there
	if(paperHandle !== null) {
		paperHandle.clear();
	}
	
	//Creates the raphael object and draws the tree
	//var root = getTree();
	
	//Get tree from clustering algorithm
	var root = getClusteredTree();
	
	var width = 1000;
	var height = 2000;

	var paper = Raphael("clusterZone", width, height);
	//var paper = Raphael(200, 50, width, height);
	
	
	root = traverseTreeAndAddShape(paper, root, 0);
	
	paperHandle = paper;
}



