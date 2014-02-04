//#######################
//Add region not applied
//Didnt pushed into subArray
//

//#
var itemsArray = new Array();
var domainArray = new Array();
var regionArray = new Array();
var secondaryStrucArray = new Array();
var variantArray = new Array();
var bindingArray = new Array();
var residueArray = new Array();
var peptideArray = new Array();
var transmemDomainArray = new Array();
var extramemDomainArray = new Array();
var intramemDomainArray = new Array();
var others = new Array;

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

document.getElementById('localfile').addEventListener('change', handleFileSelect, false);

$(document).ready(function() {
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

	$("#exportGFF").click(function() {
		console.log("hello");
		downloadGff(identifier+'Export.gff');
	});

	$("#exportSVG").click(function() {
		viewSVG();
	});
});
// $(document).on('click', '#draw', function() {
// 	identifier = $("#identifier").val();
// 	url = $("#URL").val();
// 	if (url == ""){
// 		url = "http://websitescraper.heroku.com/?url=http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/"+identifier+"/gff2";
// 	}
// 	urlpass = url + "?s=RIL.BO&callback=?";
// 	$.getJSON(urlpass, function(result) {
// 		process(result);
// 	});
// });


function process(result) {
		loadGff(result);
		drawCoordinate(start, end);
		drawDomain(domainArray);
		drawDomainText(domainArray);


		//update placeholder in add
		$("#addStart").attr("placeholder", "0 - " + end);
		$("#endStart").attr("placeholder", "0 - " + end);

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
		if (transmemDomainArray.length != 0) {
			drawRegion(transmemDomainArray);
		}
		if(extramemDomainArray.length != 0) {
			drawRegion(extramemDomainArray);
		}
		if(intramemDomainArray.length != 0) {
			drawRegion(intramemDomainArray);
		}
		if(secondaryStrucArray.length != 0) {
			drawRegion(secondaryStrucArray);
		}
		showRegionText(regionArray);
		loadLeftUpperCheckList(domainArray);
		loadLeftUpperCheckList(regionArray);

		//Load Hide Domain text
		$("#leftUpper").append('<label class="checkbox"><input type="checkbox" id ="hideText">Hide Domain Text</label>');
		$("#hideText").bind("click", function () {
			$(".domainText").toggle(!this.checked);
		});
		//End of load hide domain text
}
function loadGff(result) {
	console.log("hello from loadGff");
    line = result.split("\n");

    var startRead = 0;
    while (line[startRead][0] == "#" || line[startRead] == "") {
    	startRead++;
    }

	lineNum = line.length-1;
	itemsNum = lineNum - startRead;
	id = line[3].split(" ")[1];
	start = line[3].split(" ")[2];
	end = line[3].split(" ")[3];


	//itemsArray contains all the items in file
	for (var i = startRead; i < line.length-1; i++) {
		//Make info (Note and Link) into array
		var infoArray = new Array();
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

function loadLeftUpperCheckList(array) {
	for (var i = 0; i < array.length; i++) {
		var thisItem = array[i];
		var domainName = "";
		var appendContent = thisItem.type + " [" + thisItem.iStart + " -> " + thisItem.iEnd + "] ";
		if (thisItem.info[0]) {
			domainName = thisItem.info[0].content;
			appendContent += " : " + domainName;
		}
		if (array === domainArray) {
			$("#leftUpper").append('<label class="checkbox"><input type="checkbox" checked=true id =\"'+array[i].lineId+'\">'+appendContent+'</label>');	
		}
		else {
			$("#leftUpper").append('<label class="checkbox"><input type="checkbox" id =\"'+array[i].lineId+'\">'+appendContent+'</label>');
		}
		
		$("#"+array[i].lineId).bind("click", function () {
    		$("#"+this.id+"svg").toggle(this.checked);
    		$("#"+this.id+"text").toggle(this.checked);
    	});
	}
}

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
		if(thisItem.type=="polypeptide_domain") {
			var domainY = coord_y + 2;
			var domainH = svgHeight -4;
			var svgId = thisItem.lineId+"svg";
			var domain = makeSVG('rect', {x: domainStart, y: domainY, width:domainWidth, height:domainH, id: svgId, fill:"pink", "class":"domain"});
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
			var region_y = coord_y+65;
			var region_h = svgHeight - 6;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, "display" :"none", fill:"red", "class":"region"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "transmembrane") {
			var region_y = coord_y+65;
			var region_h = svgHeight - 6;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, "display" :"none", fill:"red", "class":"transmembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "extramembrane") {
			var region_y = coord_y+65;
			var region_h = svgHeight - 6;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, "display" :"none", fill:"red", "class":"extramembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "intramembrane") {
			var region_y = coord_y+65;
			var region_h = svgHeight - 6;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, "display" :"none", fill:"red", "class":"intramembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "alpha_helix" || thisItem.type == "beta_strand" || thisItem.type == "turn" || thisItem.type == "coiled_coil") {
			var region_y = coord_y+120;
			var region_h = svgHeight - 6;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, "display" :"none", fill:"red", "class":"secondaryStructure"});
			document.getElementById('diagram').appendChild(region);
		}

		if (endsWith(thisItem.type, "_peptide")) {
			var region_y = coord_y+65;
			var region_h = svgHeight - 6;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, "display" :"none", fill:"red", "class":"peptide"});
			document.getElementById('diagram').appendChild(region);
		}
	}
}

function showRegionText(itemsArray) {
	for (var i = 0; i< itemsArray.length; i++) {
		var thisItem = itemsArray[i];
		var regionStart = thisItem.iStart*(svgWidth/end);
		var regionEnd = thisItem.iEnd*(svgWidth/end);
		var regionWidth = regionEnd - regionStart;
		var textId = thisItem.lineId+"text";
		var regionName;
		if (thisItem.info[0]){
			regionName = thisItem.info[0].content;
		}
		var regionTextId = "region" + i;
		if(thisItem.type == "polypeptide_region") {
			var regionText_y = svgBoxHeight/2;
			var regionText = makeSVGText('text', {x: regionStart, y: regionText_y,"id":regionTextId, id: textId, "font-size": 20, "class": "regionText", fill:"black", visibility:"hidden"}, regionName);
			document.getElementById('diagram').appendChild(regionText);
		}
	}
}

function drawSite (array) {
	for (var i = 0; i < array.length; i++) {
		var thisItem = array[i];
		var starLocation = thisItem.iStart*(svgWidth/end);
		var circle_y = svgBoxHeight/2+5 + 30;
		var text_y = circle_y+5;
		var svgId = thisItem.lineId+"svg";
		var textId = thisItem.lineId+ "text";
		if (endsWith(thisItem.type, "variant_site")) {
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "display" :"none", "class": "variant"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13, "display" :"none",fill: "white", "text-anchor": "middle", id: textId, "class": "variantText"}, "V");
			document.getElementById('diagram').appendChild(siteText);
		}
		if (thisItem.type == "metal_contact" || thisItem.type == "binding_motif") {
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "display" :"none", "class": "binding"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13, "display" :"none",fill: "white", "text-anchor": "middle", id: textId, "class": "bindingText"}, "#");
			document.getElementById('diagram').appendChild(siteText);
		}
		if (endsWith(thisItem.type, "residue")) {
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 7.5, id: svgId, "display" :"none", "class": "residue"});
			document.getElementById('diagram').appendChild(site);
			var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13, "display" :"none",fill: "white", "text-anchor": "middle", id: textId, "class": "residueText"}, "@");
			document.getElementById('diagram').appendChild(siteText);
		}

	}
}



function displayRegionInfo(event, regionTextId, show){ 
  	var info = document.getElementById(regionTextId);
 	 if(!show) {
    	info.setAttribute("visibility", "hidden");
	}
	else {
	info.setAttribute("visibility", "visible");
	}
}

function addToArrayByType(item) {
	// var domainArray = new Array();
	if (endsWith(item.type, "domain")){
		domainArray.push(item);
	}
    // transmemDomainArray = new Array();
    else if (item.type == "transmembrane") {
    	transmemDomainArray.push(item);
    }
	// extramemDomainArray = new Array();
	else if (item.type == "extramembrane") {
		extramemDomainArray.push(item);
	}
	// intramemDomainArray = new Array();
	else if (item.type == "intramembrane") {
		intramemDomainArray.push(item);
	}
	// var regionArray = new Array();
	else if (endsWith(item.type, "region") && item.type != "mature_protein_region"){
		regionArray.push(item);
	}		
	// var secondaryStrucArray = new Array();
	else if(item.type == "alpha_helix" || item.type == "beta_strand" || item.type == "turn" || item.type == "coiled_coil"){
		secondaryStrucArray.push(item);
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

/******************************************************************************************
Checkbox functions                                                                        *
*******************************************************************************************/
$('#transmemCheckbox').click(function () {
	if ($(".transmembrane").length != 0){
		$(".transmembrane").toggle(this.checked);
		displayInfoOnRight (transmemDomainArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
    		$("#viewInfo").append('<span class="alert"> There is no transmembrane domain in this query.</span></br>');
    	}
    	
    }
});
$('#extramemCheckbox').click(function () {
	if ($(".extramembrane").length != 0){
		$(".extramembrane").toggle(this.checked);
		displayInfoOnRight (extramemDomainArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
    		$("#viewInfo").append('<span class="alert"> There is no extramembrane domain in this query.</span></br>');
    	}
    }    
});
$('#intramemCheckbox').click(function () {
	if ($(".intramembrane").length != 0){
		$(".intramembrane").toggle(this.checked);
		displayInfoOnRight (intramemDomainArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
    		$("#viewInfo").append('<span class="alert"> There is no intramembrane domain in this query.</span></br>');
    	}
    }
});
$('#secondaryCheckbox').click(function() {
	if ($(".secondaryStructure").length != 0){
		$(".secondaryStructure").toggle(this.checked);
		displayInfoOnRight (secondaryStrucArray);
		$(".itemInfo").toggle(this.checked);

	}
    else {
    	if (this.checked) {
    		$("#viewInfo").append('<span class="alert"> There is no secondary structure in this query.</span></br>');
    	}
    }
});
$('#peptideCheckbox').click(function() {
	if ($(".peptide").length != 0){
		$(".peptide").toggle(this.checked);
		displayInfoOnRight (peptideArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
	    	$("#viewInfo").append('<span class="alert"> There is no special peptide structure in this query.</span></br>');
    	}
    }
});

$('#variantCheckbox').click(function() {
	if ($(".variant").length != 0){
		var marker = $("#variantSelector").val();
		$(".variantText").text(String(marker).trim());
		$(".variant").toggle(this.checked);
		$(".variantText").toggle(this.checked);
		displayInfoOnRight (variantArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
	    	$("#viewInfo").append('<span class="alert"> There is no variant site in this query.</span></br>');
    	}
    }
});

$('#bindingCheckbox').click(function() {
	if ($(".binding").length != 0){
		var marker = $("#variantSelector").val();
		$(".variantText").text(String(marker).trim());
		$(".binding").toggle(this.checked);
		$(".bindingText").toggle(this.checked);
		displayInfoOnRight (bindingArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
	    	$("#viewInfo").append('<span class="alert"> There is no binding site in this query.</span></br>');
    	}
    }
});

$('#residueCheckbox').click(function() {
	if ($(".residue").length != 0){
		var marker = $("#residueSelector").val();
		$(".residueText").text(String(marker).trim());
		$(".residue").toggle(this.checked);
		$(".residueText").toggle(this.checked);
		displayInfoOnRight (residueArray);
		$(".itemInfo").toggle(this.checked);
	}
    else {
    	if (this.checked) {
	    	$("#viewInfo").append('<span class="alert"> There is no special residue in this query.</span></br>');
    	}
    }
});



/******************************************************************************************
Add Items                                                                                 *
*******************************************************************************************/
$("#add").click(function(){

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
});

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

	//If item.type == regions or dominant
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
	var idLine = "##sequence-retion " + identifier + " " + start + " " + end; 
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
			if (array[i].info.length != 0){
				var itemsString = identifier + "\tUniProtKB" + "\t"+array[i].type + "\t" + 
   				array[i].iStart + "\t" + array[i].iEnd + "\t.\t.\t" + array[i].info[0].type+ " \"" + array[i].info[0].content + "\"";
			}
			else {
				var itemsString = identifier + "\tUniProtKB" + "\t"+array[i].type + "\t" + 
   				array[i].iStart + "\t" + array[i].iEnd + "\t.\t.\t";
			}
			gffArray.push(itemsString);
		}
	}
}


//$("#exportSVG").click(viewSVG());


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

function displayInfoOnRight (array) {
	document.getElementById("viewInfo").innerHTML = "";
	for (var i = 0; i < array.length; i++) {
		var infoNote = "";
		if (array[i].info[0]) {
			infoNote = ": " + array[i].info[0].content;
		}
		var span = "<span class=\"itemInfo\" id=\"" + array[i].lineId+ "info\"> " + array[i].type + " ["
					+array[i].iStart+" --> " + array[i].iEnd + "] " + infoNote + " </span></br>";

		var thisId = array[i].lineId + "info";
		$( "#viewInfo" ).append( span );
		$("#" + thisId).mouseover(function () {
			$(this).css("color", "red");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length-4;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "red");
			$("#" + svgid).attr("stroke-width", 3);
		});
		$("#" + thisId).mouseout(function () {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length-4;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
		});

	}
}












