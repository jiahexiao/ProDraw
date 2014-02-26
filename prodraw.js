/*
 * ProDraw v2.0.0 by @jiahe
 * The first independent reserach project by Jiahe
 * stylesheet is in seperate file.
*/

var itemsArray = new Array();
var domainArray = new Array();
var regionArray = new Array();
var alphaArray = new Array();
var betaArray = new Array();
var turnArray = new Array();
var coiledArray = new Array();
var variantArray = new Array();
var bindingArray = new Array();
var residueArray = new Array();
var peptideArray = new Array();
var transmembraneArray = new Array();
var extramembraneArray = new Array();
var intramembraneArray = new Array();
var others = new Array();
var colors = ["#FEC56B", "#80D4DF", "#78ecb2", "#e37bf8", "#faaeb2", "#9ea5e4", "#ddef7a", "#90cae9", "#cf8f80"];

var start;
var end;
var id;
var identifier;
var url;
var svgHeight = 40;
var svgBoxHeight = 150;
var svgWidth = 800;
var coord_x = 0;
var coord_y = 55;

var addType;
var addStart;
var addEnd;
var addNote;
var itemsNum;



$(document).ready(function() {
	 document.getElementById('localfile').addEventListener('change', handleFileSelect, false);
	// $('#localfile').change(function() {
	// 	handleFileSelect();
	// });

	//Attach function to draw
	$('#draw').click(function() {
		identifier = $("#identifier").val();
		url = $("#URL").val();
		if (url == ""){
			url = "http://websitescraper.heroku.com/?url=http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/"+identifier+"/gff2";
		}
		urlpass = url + "?s=RIL.BO&callback=?";
		$.getJSON(urlpass, function(result) {
			process(result);
		});
	});

	//Attach function to exportGFF
	$("#exportGFF").click(function() {
		downloadGff(identifier + 'Export.gff');
	});

	//Attach function to exportSVG
	$("#exportSVG").click(function() {
		viewSVG();
	});

	//The window scoll down when start clicked
	$("#start").click(function() {
		var $this = $(this),
			index = $("#start").index(this);

		$(window).scrollTop($("#upper").eq(index).offset().top);

	});

	$("#add").click(function(){
		addItem();
	
	});

	//*********************************************
	//Change color of selected element in selector*
	//*********************************************
	$("#regionColorSelect").change(function() {changeColor("region"); });

	$("#peptideColorSelect").change(function() {changeColor("peptide");});

	$("#transmembraneColorSelect").change(function() {changeColor("transmembrane");});

	$("#extramembraneColorSelect").change(function() {changeColor("extramembrane");});

	$("#intramembraneColorSelect").change(function() {changeColor("intramembrane")});

	$("#alphaColorSelect").change(function() {changeColor("alpha");});
	
	$("#betaColorSelect").change(function() {changeColor("beta");});
	
	$("#turnColorSelect").change(function() {changeColor("turn");});

	$("#coiledColorSelect").change(function(){changeColor("coiled");});

	//**********************************************
	//Change symbol of selected element in selector*
	//**********************************************
	$("#variantSelector").change(function() {
		changeSymbol("variant");
	});
	$("#bindingSelector").change(function() {
		changeSymbol("binding");
	});
	$("#residueSelector").change(function() {
		changeSymbol("residue");
	});
	/*************************
	*Checkbox Functions      *
	**************************/
	// $("#domainCheckbox").click(function() {
	// 	$(".domain").toggle(this.checked);
	// });
	$("#domainCheckbox").click(function() {
		checkToggle("domain", "polypeptide domain", "#domainInfoDiv");
	});

	$("#regionCheckbox").click(function() {
		checkToggle("region", "polypeptide region", "#regionInfoDiv");
	});

	$("#peptideCheckbox").click(function() {
		checkToggle("peptide", "special peptide", "#peptideInfoDiv");
	});

	$("#transmembraneCheckbox").click(function() {
		checkToggle("transmembrane", "transmembrane domain", "#transmembraneInfoDiv");
	});	

	$("#extramembraneCheckbox").click(function() {
		checkToggle("extramembrane", "extramembrane domain", "#extramembraneInfoDiv");
	});	

	$("#intramembraneCheckbox").click(function() {
		checkToggle("intramembrane", "intramembrane domain", "#intramembraneInfoDiv");
	});

	$("#alphaCheckbox").click(function() {
		checkToggle("alpha", "alpha helix structure", "#alphaInfoDiv");
	});	

	$("#betaCheckbox").click(function() {
		checkToggle("beta", "beta strand structure", "#betaInfoDiv");
	});	

	$("#turnCheckbox").click(function() {
		checkToggle("turn", "turn structure", "#turnInfoDiv");
	});	

	$("#coiledCheckbox").click(function() {
		checkToggle("coiled", "coiled coil structure", "#coiledInfoDiv");
	});	

	$("#variantCheckbox").click(function() {
		checkToggleSite("variant", "variant site", "#variantInfoDiv");
	});

	$("#bindingCheckbox").click(function() {
		checkToggleSite("binding", "binding site", "#bindingInfoDiv");
	});

	$("#residueCheckbox").click(function() {
		checkToggleSite("residue", "residue", "#residueInfoDiv");
	});

	/*************************
	*Show and Hide Div       *
	**************************/
	// $("#domainShowTriangle").click(function() {
	// 	hideDiv("domainShowTriangle", "#domainInfoDiv");
	// });

	// $("#domainShowTriangleHide").click(function() {
	// 	showDiv("domainShowTriangle", "#domainInfoDiv");
	// });

	// $("#regionShowTriangle").click(function() {
	// 	hideDiv("regionShowTriangle", "#regionInfoDiv");
	// });

	// $("#regionShowTriangleHide").click(function() {
	// 	showDiv("regionShowTriangle", "#regionInfoDiv");
	// });

	// $("#peptideShowTriangle").click(function() {
	// 	hideDiv("peptideShowTriangle", "#peptideInfoDiv");
	// });

	// $("#peptideShowTriangleHide").click(function() {
	// 	showDiv("peptideShowTriangle", "#peptideInfoDiv");
	// });

	// $("#membraneShowTriangle").click(function() {
	// 	hideDiv("membraneShowTriangle", "#membraneDomainInfoDiv");
	// });

	// $("#membraneShowTriangleHide").click(function() {
	// 	showDiv("membraneShowTriangle", "#membraneDomainInfoDiv");
	// });

	// $("#secondaryShowTriangle").click(function() {
	// 	hideDiv("secondaryShowTriangle", "#secondaryStructureInfoDiv");
	// });

	// $("#secondaryShowTriangleHide").click(function() {
	// 	showDiv("secondaryShowTriangle", "#secondaryStructureInfoDiv");
	// });

	// $("#siteShowTriangle").click(function() {
	// 	hideDiv("siteShowTriangle", "#siteInfoDiv");
	// });

	// $("#siteShowTriangleHide").click(function() {
	// 	showDiv("siteShowTriangle", "#siteInfoDiv");
	// });

	/*************************
	*Display Info on Right   *
	**************************/



});


//Process read the data in gff file
function process(result) {
		
		loadGff(result);

		drawCoordinate(start, end);
		drawDomain(domainArray);
		drawDomainText(domainArray);


		//update placeholder in add
		$("#addStart").attr("placeholder", "1 - " + end);
		$("#addEnd").attr("placeholder", "1 - " + end);

		if (variantArray.length != 0){
			drawSite(variantArray);
		}

		if (bindingArray.length != 0){
			drawSite(bindingArray);
		}

		if (residueArray.length != 0) {
			drawSite(residueArray);
		}

		if (regionArray.length != 0){
			drawRegion(regionArray);
		}
		if (transmembraneArray.length != 0) {
			drawRegion(transmembraneArray);
		}
		if(extramembraneArray.length != 0) {
			drawRegion(extramembraneArray);
		}
		if(intramembraneArray.length != 0) {
			drawRegion(intramembraneArray);
		}

		if (alphaArray.length != 0) {
			drawRegion(alphaArray);
		}
		if (betaArray.length != 0) {
			drawRegion(betaArray);
		}
		if (turnArray.length != 0) {
			drawRegion(turnArray);
		}
		if (coiledArray.length != 0) {
			drawRegion(coiledArray);
		}
		//showRegionText(regionArray);
		//loadLeftUpperCheckList(domainArray);
		//loadLeftUpperCheckList(regionArray);

		//Load Hide Domain text
		// $("#leftUpper").append('<label class="checkbox"><input type="checkbox" id ="hideText">Hide Domain Text</label>');
		// $("#hideText").bind("click", function () {
		// 	$(".domainText").toggle(!this.checked);
		// });
		//End of load hide domain text
	displayInfoOnRight(alphaArray, "#alphaInfoDiv");
	displayInfoOnRight(betaArray, "#betaInfoDiv");
	displayInfoOnRight(turnArray, "#turnInfoDiv");
	displayInfoOnRight(coiledArray, "#coiledInfoDiv");
	displayInfoOnRight(transmembraneArray, "#transmembraneInfoDiv");
	displayInfoOnRight(intramembraneArray, "#intramembraneInfoDiv");
	displayInfoOnRight(extramembraneArray, "#extramembraneInfoDiv");
	displayInfoOnRight(domainArray, "#domainInfoDiv");	
	displayInfoOnRight(regionArray, "#regionInfoDiv");
	displayInfoOnRight(peptideArray, "#peptideInfoDiv");
	displayInfoOnRight(variantArray, "#variantInfoDiv");
	displayInfoOnRight(bindingArray, "#bindingInfoDiv");
	displayInfoOnRight(residueArray, "#residueInfoDiv");	
}

//loadGff read info to array
function loadGff(result) {
	
    line = result.split("\n");

    //console.log(line[4]);
    var startRead = 0;
    while (line[startRead][0] == "#" || line[startRead] == "") {
    	startRead++;
    }

	lineNum = line.length-1;
	itemsNum = lineNum - startRead;
	id = line[3].split(" ")[1];
	start = line[3].split(" ")[2];
	end = line[3].split(" ")[3];
	identifier = id;

	//itemsArray contains all the items in file
	for (var i = startRead; i < line.length-1; i++) {
		//Make info (Note and Link) into array
		var infoArray = new Array();
		//console.log(line[i].split("\t")[7]);
		if (line[i].split("\t")[8]) {
			var infoItemArray = line[i].split("\t")[8].split(";");
			for (var j = 0; j<infoItemArray.length; j++) {
				var infoItem = {
					id: j,
					type: $.trim(infoItemArray[j]).split(" ")[0],
					content: $.trim(infoItemArray[j]).split("\"")[1]
				};
				infoArray.push(infoItem);
			}
		}
		// Push item into itemsArray
		var item = {
			lineId: i-4,
			type: line[i].split("\t")[2],
			iStart: line[i].split("\t")[3],
			iEnd: line[i].split("\t")[4],
			info: infoArray,
			other: false
		};
		itemsArray.push(item);
		addToArrayByType(item);	
	}
}

//read itemarray to specific array
function addToArrayByType(item) {
	// var domainArray = new Array();
	if (endsWith(item.type, "domain")){
		domainArray.push(item);
	}
    // transmembraneArray = new Array();
    else if (item.type == "transmembrane") {
    	transmembraneArray.push(item);
    }
	// extramembraneArray = new Array();
	else if (item.type == "extramembrane") {
		extramembraneArray.push(item);
	}
	// intramembraneArray = new Array();
	else if (item.type == "intramembrane") {
		intramembraneArray.push(item);
	}
	// var regionArray = new Array();
	else if (endsWith(item.type, "region") && item.type != "mature_protein_region"){
		regionArray.push(item);
	}		
	// var secondaryStrucArray = new Array();
	else if(item.type == "alpha_helix") {
		alphaArray.push(item);
	}

	else if(item.type == "beta_strand") {
		betaArray.push(item);
	}

	else if(item.type == "turn") {
		turnArray.push(item);
	}

	else if(item.type == "coiled_coil") {
		coiledArray.push(item);
	}

	// var variantArray = new Array();
	else if(endsWith(item.type, "variant_site")) {
		variantArray.push(item);
	}
	// var bindingArray = new Array();
	else if (item.type == "metal_contact" || item.type == "binding_motif") {
		bindingArray.push(item);
	}
	// var residueArray = new Array();
	else if (endsWith(item.type, "residue")) {
		residueArray.push(item);
	}
	// var peptideArray = new Array();
	else if (endsWith(item.type, "_peptide")) {
		peptideArray.push(item);
	}
	else {
		item.other = true;
		others.push(item);
	}
}

//draw the coordinate bar
function drawCoordinate(start, end) {
	var max = parseInt(end/50);
	var pathD = "";
	for (var i = 1; i <= max; i++){
		var x = parseInt(svgWidth/end*50*i);
		var x_ = x+2;
		var c = 50*i;
		var pathD_h = coord_y -5;
		pathD += " M " + x +" "+pathD_h+" L " + x_ + " "+pathD_h+" ";
		var textY = coord_y - 10;	
		var coord = makeSVGText('text', {x: x, y: textY, "class": "coordinate"}, c);
		document.getElementById('diagram').appendChild(coord);	
	}
	var path = makeSVG('path', {"class": "ruler", d: pathD});
	document.getElementById('diagram').appendChild(path);
}

function drawDomain(itemsArray) {
	for (var i =0; i < itemsArray.length; i++) {
		var thisItem = itemsArray[i];

		var domainStart = thisItem.iStart*(svgWidth/end);
		var domainEnd = thisItem.iEnd*(svgWidth/end);
		var domainWidth=domainEnd-domainStart;
		var fill;
		if (i <= 6) {
			fill = colors[i];
		}
		else {
			fill = colors[i%8];
		}
		
		if(thisItem.type=="polypeptide_domain") {
			var domainY = coord_y + 2;
			var domainH = svgHeight -4;
			var svgId = thisItem.lineId+"svg";
			var domain = makeSVG('rect', {x: domainStart, y: domainY, width:domainWidth, height:domainH, id: svgId, fill:fill, "class":"domain"});
			document.getElementById('diagram').appendChild(domain);
		}
	}
}

function drawDomainText(itemsArray) {
	for (var i = 0; i < itemsArray.length; i++) {
		var thisItem = itemsArray[i];
		var domainStart = thisItem.iStart*(svgWidth/end);
		var domainEnd = thisItem.iEnd*(svgWidth/end);
		var textId = thisItem.lineId+"text";
		var domainName;
		
		if (thisItem.info[0]) {
			domainName = thisItem.info[0].content;
		}
		var textX = (domainStart + domainEnd)/2;
		if(thisItem.type == "polypeptide_domain") {
			var domainText_y = svgBoxHeight/2+7;
			var domainText = makeSVGText('text', {x: textX, y: domainText_y, "font-size": 20, id: textId, "class": "domainText"}, domainName);
			document.getElementById('diagram').appendChild(domainText);
		}
	}
}

function drawSite (array) {
	for (var i = 0; i < array.length; i++) {
		var thisItem = array[i];
		var starLocation = thisItem.iStart*(svgWidth/end);
		var circle_y;
		var text_y; 
		var svgId = thisItem.lineId+"svg";
		var textId = thisItem.lineId+ "text";
		if (endsWith(thisItem.type, "variant_site")) {
			circle_y = svgBoxHeight/2+5 + 30;
			text_y = circle_y+5;
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "class": "variant"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline",fill: "white", "text-anchor": "middle", id: textId, "class": "variantText"}, "V");
			document.getElementById('diagram').appendChild(siteText);
		}
		if (thisItem.type == "metal_contact" || thisItem.type == "binding_motif") {
			circle_y = svgBoxHeight/2+5 + 50;
			text_y = circle_y+5;
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "class": "binding"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline",fill: "white", "text-anchor": "middle", id: textId, "class": "bindingText"}, "#");
			document.getElementById('diagram').appendChild(siteText);
		}
		if (endsWith(thisItem.type, "residue")) {
			circle_y = svgBoxHeight/2+5 + 70;
			text_y = circle_y+5;
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "class": "residue"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline", fill: "white", "text-anchor": "middle", id: textId, "class": "residueText"}, "@");
			document.getElementById('diagram').appendChild(siteText);
		}

	}
}

function drawRegion(array) {
	for (var i = 0; i< array.length; i++) {
		var thisItem = array[i];
		var regionStart = thisItem.iStart*(svgWidth/end);
		var regionEnd = thisItem.iEnd*(svgWidth/end);
		var regionWidth = regionEnd - regionStart;
		var regionName;
		if (thisItem.info[0]){
			regionName = thisItem.info[0].content;
		}
		var svgId = thisItem.lineId+"svg";
//		var mouseover = "displayRegionInfo(event,'"+"region"+i+"', true)";
//		var mouseout = "displayRegionInfo(event,'"+"region"+i+"', false)";
		if (thisItem.type == "polypeptide_region") {
			var region_y = coord_y+110;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"region"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "transmembrane") {
			var region_y = coord_y+170;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"transmembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "extramembrane") {
			var region_y = coord_y+170;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"extramembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "intramembrane") {
			var region_y = coord_y+170;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"intramembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "alpha_helix") {
			var region_y = coord_y+140;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"yellow", "class":"alpha"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "beta_strand") {
			var region_y = coord_y+140;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"yellow", "class":"beta"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "turn") {
			var region_y = coord_y+140;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"yellow", "class":"turn"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "coiled_coil") {
			var region_y = coord_y+140;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"yellow", "class":"coiled"});
			document.getElementById('diagram').appendChild(region);
		}

		if (endsWith(thisItem.type, "_peptide")) {
			var region_y = coord_y+110;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"peptide"});
			document.getElementById('diagram').appendChild(region);
		}
	}
}














/******************************************************************************************
Upload Local Gff File                                                                     *
*******************************************************************************************/
function handleFileSelect(evt) {
	var files = evt.target.files;
	var output = [];

	if (files.length > 1) {
		window.alert("You can only upload one file.");
	}

	else {

		if (!document.getElementById('localfile').value.match(/gff$/)) {
			window.alert("Invalid file type.");
		}

		else {

			output.push('<li> <strong>', escape(files[0].name), '</strong> (', files[0].type || 'n/a', ') - ', 
					files[0].size, ' bytes, last modified: ',
					files[0].lastModifiedDate ? files[0].lastModifiedDate.toLocaleDateString(): 'n/a', '</li>');

			document.getElementById('fileList').innerHTML = '<ul>' + output.join('') + '</ul>';

			var reader = new FileReader();
			reader.onload = (function(e) {
				
				process(reader.result);
			});
			reader.readAsText(files[0]);	
		}
	}
}

/******************************************************************************************
Export SVG/Gff                                                                            *
*******************************************************************************************/

function viewSVG(){
	var svg = document.getElementById("diagram");
	var svg_xml = (new XMLSerializer).serializeToString(svg);
	var myWindow = window.open('', '_blank');
	myWindow.document.writeln("<?xml version=\"1.0\" standalone=\"no\"?>");
	myWindow.document.writeln("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">");
    myWindow.document.writeln("<!-- " + identifier + " SVG Diagram -->");
    myWindow.document.writeln("<title> " + identifier + " SVG diagram </title>");
    myWindow.document.writeln("<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheet.css\">");
	myWindow.document.writeln("");
	myWindow.document.writeln(svg_xml);
}

function downloadGff(filename) {
	var text = generateGff();
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:gff/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    
    pom.click();
}

function generateGff() {
	var idLine = "##sequence-region " + identifier + " " + start + " " + end; 
	var gffArray = 
   ['##gff-version 2',
    '##Type Protein',
    '',
    idLine
   ];
   pushToGffArray(itemsArray, gffArray);

   return gffArray.join("\n");

}

function pushToGffArray(array, gffArray) {
	for (var i = 0; i < array.length; i++) {
		if (!array[i].other) {
			var itemsString;
			if (array[i].info.length != 0){
				itemsString = identifier + "\tUniProtKB" + "\t"+array[i].type + "\t" + 
   				array[i].iStart + "\t" + array[i].iEnd + "\t.\t.\t.\t" + array[i].info[0].type+ " \"" + array[i].info[0].content + "\"";
			}
			else {
				itemsString = identifier + "\tUniProtKB" + "\t"+array[i].type + "\t" + 
   				array[i].iStart + "\t" + array[i].iEnd + "\t.\t.\t.\t";
			}
			gffArray.push(itemsString);
		}
	}
}

/******************************************************************************************
Add Items                                                                                 *
*******************************************************************************************/


function addItem() {
	addType = $("#addType").val();
	addStart = $("#addStart").val();
	addEnd = $("#addEnd").val();
	addNote = $("#addNote").val();
	var addInfoArray = new Array();
	var addInfoItem = {
		id: 0,
		type: "Note",
		content: addNote,
	};
	addInfoArray.push(addInfoItem);
	var addItem = { 
		lineId: itemsNum,
		type: addType,
		iStart: addStart,
		iEnd: addEnd,
		info: addInfoArray,
		other: false
	};
	itemsArray.push(addItem);
	addToArrayByType(addItem);
	itemsNum++;
	drawItem(addItem);
}

function drawItem(item) {
	if(endsWith(item.type, "variant_site") 
		|| item.type == "metal_contact" 
		|| item.type == "binding_motif" 
		|| endsWith(item.type, "residue")) {
		var thisItem = item;
		var starLocation = thisItem.iStart*(svgWidth/end);
		var circle_y = svgBoxHeight/2+5 + 30;
		var text_y = circle_y+5;
		var svgId = thisItem.lineId+"svg";
		var textId = thisItem.lineId+ "text";
		if (endsWith(thisItem.type, "variant_site")) {
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "class": "variant", stroke: "#FF00FF"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13, fill: "white", "text-anchor": "middle", id: textId, "class": "variantText"}, "V");
			document.getElementById('diagram').appendChild(siteText);
		}
		if (thisItem.type == "metal_contact" || thisItem.type == "binding_motif") {
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId,  "class": "binding", stroke: "#FF00FF"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13, fill: "white", "text-anchor": "middle", id: textId, "class": "bindingText"}, "#");
			document.getElementById('diagram').appendChild(siteText);
		}
		if (endsWith(thisItem.type, "residue")) {
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "class": "residue", stroke: "#FF00FF"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13, fill: "white", "text-anchor": "middle", id: textId, "class": "residueText"}, "@");
			document.getElementById('diagram').appendChild(siteText);
		}

	}

	else {
		var newItem = new Array();
		newItem.push(item);
		drawRegion(newItem);
		//showRegionText(newItem);


	}

	//If item.type == regions or dominant
}



/******************************************************************************************
Helper functions                                                                          *
*******************************************************************************************/
function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

function makeSVGText (tag, attrs, text) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    el.textContent = text;
    return el;
}



function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function changeColor(thisType) {
	var thisColor = $("#"+thisType+"ColorSelect").val();
	$("."+thisType).css("fill", thisColor);
}

function changeSymbol(thisType) {
	var thisSymbol = $("#"+thisType+"Selector").val();
	$("."+thisType+"Text").text(String(thisSymbol).trim());
}

function checkToggle(thisType, displayName, thisDiv) {
	var thisClass = "."+thisType;
	var thisCheckbox = "#" + thisType + "Checkbox";
	var thisArray = window[thisType+"Array"];
	
	// console.log(thisArray);
	// console.log(window[thisArray][0].type);
	// console.log("==================above from checkToggle");
	$(thisDiv).toggle($(thisCheckbox).checked);
	if (thisArray.length != 0) {
		$(thisClass).toggle($(thisCheckbox).checked);

		// $(".itemInfo").toggle(this.checked);
	}

	else {
		if (thisCheckbox.checked) {
			$("#viewInfo").append('<span class="alertMessage"> There is no'+displayName+ 'in this query.</span></br>');
		}
	}
}


function checkToggleSite(thisType, displayName, thisDiv) {
	var thisClass = "."+thisType;
	var thisCheckbox = "#" + thisType + "Checkbox";
	var thisArray = window[thisType+"Array"];
	var thisText = "."+thisType+ "Text";
	$(thisDiv).toggle($(thisCheckbox).checked);
	if (thisArray.length != 0) {
		$(thisClass).toggle($(thisCheckbox).checked);
		$(thisText).toggle($(thisCheckbox).checked);
		// displayInfoOnRight(thisArray, "#siteInfoDiv");
		// $(".itemInfo").toggle(this.checked);
	}

	else {
		if (thisCheckbox.checked) {
			$("#viewInfo").append('<span class="alertMessage"> There is no'+displayName+ 'in this query.</span></br>');
		}
	}
}

function hideDiv(thisShowTriangle, thisDiv) {
	$("#"+thisShowTriangle).click(function() {
		$(thisDiv).hide();
		$("#"+thisShowTriangle).replaceWith('<span id="'+thisShowTriangle +'Hide">&#9658;</span>');
	});
}

function showDiv(thisShowTriangle, thisDiv) {
	$("#"+thisShowTriangle+"Hide").click(function() {
		$(thisDiv).show();
		$("#"+thisShowTriangle + "Hide").replaceWith('<span id="'+thisShowTriangle +'">&#9660;</span>');
	});

}

function displayInfoOnRight (array, divType) {

	for (var i = 0; i < array.length; i++) {
		
		var infoNote = "";
		if (array[i].info[0]) {
			infoNode = ": " + array[i].info[0].content;
		}
		var span = "<span class=\"itemInfo\" id=\"" + array[i].lineId+ "info\"> " + array[i].type + " ["
					+array[i].iStart+" --> " + array[i].iEnd + "] " + infoNote + " </span></br>";
		
		var thisId = array[i].lineId + "info";
		console.log(divType);
		 $(divType).append(span);
		// $("#lower").append(span);
		$("#" + thisId).mouseover(function () {
			$(this).css("color", "red");
			var thisid = $(this).attr("id");
			thisId = String (thisid);

			var subEnd = this.id.length-4;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "red");
			$("#" + svgid).attr("stroke-width", 3);

		});
		$("#" + thisId).mouseout(function() {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length - 4;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
		});
	}
}

