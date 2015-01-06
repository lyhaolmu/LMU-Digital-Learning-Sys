var colorNum = 0;
var shapeNum = 0;
var attributeValNum = {};
var attributeNum = 0;
var colors = {};
var shapes = {};

function analyzeInput(strIn){
	var initialWhitespaces = new RegExp(/^\s*/g);
	var endingWhitespaces = new RegExp(/\s*$/g);
	var inputFormat = new RegExp(/^\w+(\s{1}\w+(\s{1}\w+$)?$)?$/);
	var numbers = new RegExp(/\d/g);
	var notAsciiCharacters = new RegExp(/^[a-zA-Z0-9 ]*$/);
    if (inputFormat.test(strIn)){
    	strIn = strIn.replace(initialWhitespaces);
    	strIn = strIn.replace(endingWhitespaces);
    	if ( !numbers.test(strIn) && notAsciiCharacters.test(strIn)){
      		return true;
    	}
  	}
    return false;
}


var newAttribute = function(value) {
	var val = value || $("input:text[name=attribute]").val().toLowerCase();
	
	//Check for appropriate values
	if(!analyzeInput(val)){
		alert("Please, follow the format to enter an attribute name");
		return false;
	} else {

		var key = 'attribute'+attributeNum++;
   		localStorage.setItem(key, val);
		attributeValNum[val] = 0;
		val = val.replace(new RegExp(' ', 'g'), '_');

		$('<div class= "attribute">'+val+':<div class= "valuesWrapper"> <input type="text" name="'+val+'"' + 
		'onkeydown="if (event.keyCode == 13) document.getElementById(\'add' + val + '\').click()">'+
		'<div class="button"id="add'+val+'" onclick="newAttributeValue(\''+val+'\')">Add '+val+'</div>'+
		'<div class="values" id = '+val+'s>'+val+'s picked: </div></div></div>').appendTo($("#attributes"));

		$("input:text[name=attribute]").val("");	
	}
}

var newAttributeValue = function(attrName, value) {
	var val = value || $("input:text[name="+attrName+"]").val().toLowerCase();

    //Check for appropriate values
	if(!analyzeInput(val)){
		alert("Please enter a Value name"); 
		return false;
	} else {
		var key = attrName + attributeValNum[attrName]++;
		localStorage.setItem(key, val);
		val = val.replace(new RegExp(' ', 'g'), '_');

		$('<div class="value">' + val + '</div>').appendTo($("#"+attrName+"s"));
		
		$("input:text[name="+attrName+"]").val("")
	}
}

var next = function(){
	for(attr in attributeValNum) {
		localStorage.setItem(attr+'Num', attributeValNum[attr]);
	}
	localStorage.setItem('attributeNum', attributeNum);
	window.location = "/tree";
}

var useDefault = function() {
	newAttribute("shape");
	newAttributeValue("shape", "square");
	newAttributeValue("shape", "circle");
	newAttributeValue("shape", "triangle");
	newAttributeValue("shape", "rectangle");
	
	newAttribute("size");
	newAttributeValue("size", "small");
	newAttributeValue("size", "medium");
	newAttributeValue("size", "large");
	
	newAttribute("color");
	newAttributeValue("color", "blue");
	newAttributeValue("color", "yellow");
	newAttributeValue("color", "red");
	newAttributeValue("color", "orange");
	newAttributeValue("color", "green");

	next()
}

var getSelection = function(){
	attributeNum = localStorage.getItem('attributeNum');
	global_attributes = [];
	global_attribute_options = {};
	for(var i = 0; i < attributeNum; i++) {
		var attrName = localStorage.getItem('attribute' + i);
		global_attributes.push(attrName);
		attributeValNum[attrName] = localStorage.getItem(attrName + 'Num');
		$('<form id="'+attrName+'s">Choose a '+attrName+'</br></form>').appendTo($("#attributeSelectors"));
		global_attribute_options[attrName] = [];
		
		for(var j = 0; j < attributeValNum[attrName]; j++){
			var attrVal = localStorage.getItem(attrName+j);
			global_attribute_options[attrName].push(attrVal);
			$(
				'<input type="radio" name="'+attrName+'Input" id="test" value="' + attrVal + '">' + attrVal +
				' Weight: <input class="weight" type="text" name="' + attrVal + 'Weight">' + '</br>'
			).appendTo($("#"+attrName+"s"));
			$("input:text[name="+ attrVal + "Weight]").val("1");
		}
	}
}

