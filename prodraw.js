/*
 * ProDraw v2.0.0 by @jiahe
 * The first independent reserach project by Jiahe
 * stylesheet is in seperate file.
*/

var itemsArray = new Array();
var domainArray = new Array();
var repeatArray = new Array();
var regionArray = new Array();
var alphaArray = new Array();
var betaArray = new Array();
var turnArray = new Array();
var coiledArray = new Array();

var variantArray = new Array();

var residueArray = new Array();
var peptideArray = new Array();

var transmembraneArray = new Array();
var extramembraneArray = new Array();
var intramembraneArray = new Array();

var activeArray = new Array();
var metalArray = new Array();
var bindingArray = new Array();
var modifiedArray = new Array();
var lipiArray = new Array();
var glyArray = new Array();
var others = new Array();
//var colors = ["#FEC56B", "#80D4DF", "#78ecb2", "#e37bf8", "#faaeb2", "#9ea5e4", "#ddef7a", "#90cae9", "#cf8f80"];
var colorMap = {}
colorMap[1] = "#FEC56B";
colorMap[2] = "#80D4DF";
colorMap[3] = "#78ecb2";
colorMap[4] = "#e37bf8";
colorMap[5] = "#faaeb2";
colorMap[6] = "#9ea5e4";
colorMap[7] = "#ddef7a";
colorMap[8] = "#90cae9";
colorMap[9] = "#cf8f80";
colorMap[10] = "#C49CBF";
var domainColorMap = {}
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
	$("#closeIntro").click(function(){
		$("#introDiv").hide();
	});

	$("#clear1").click(function(){
		location.reload();
	});

	$("#clear2").click(function(){
		location.reload();
	});

	$('#draw').click(function() {
		if ($("#diagram").children().length > 1) {
			window.alert("Please clear the diagram before draw new protein.");
			console.log("alert");
		}
		else {

			identifier = $("#identifier").val();
			url = $("#URL").val();
			urlpass = "http://websitescraper.heroku.com/?url=" +url + "?s=RIL.BO&callback=?";
			if (url == ""){
				url = "http://websitescraper.heroku.com/?url=http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/"+identifier+"/gff2";
				urlpass = url + "?s=RIL.BO&callback=?";
			}
			//console.log(url);
	
			$.getJSON(urlpass, function() {
			})
			.success(function(result) {process(result);})
			.error(function() {alert("No Protein Found.");});
		}
		
		
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
	$("#regionColorSelect").change(function() {changeColor("region", "regionColorSelect"); });

	$("#repeatColorSelect").change(function() {changeColor("repeat", "repeatColorSelect");});

	$("#transmembraneColorSelect").change(function() {changeColor("transmembrane", "transmembraneColorSelect");});

	// $("#extramembraneColorSelect").change(function() {changeColor("extramembrane");});

	$("#intramembraneColorSelect").change(function() {changeColor("intramembrane", "intramembraneColorSelect")});

	$("#coiledColorSelect").change(function() {changeColor("coiled", "coiledColorSelect")});

	$("#activeColorSelect").change(function() {changeColor("catalytic_residue", "activeColorSelect")});

	$("#metalColorSelect").change(function() {changeColor("metal_contact", "metalColorSelect")});

	$("#bindingColorSelect").change(function() {changeColor("binding_motif", "bindingColorSelect")});

	$("#modifiedColorSelect").change(function() {changeColor("post_translational_modification", "modifiedColorSelect")});

	$("#lipiColorSelect").change(function() {changeColor("lipoconjugated_residue", "lipiColorSelect")});

	$("#glyColorSelect").change(function() {changeColor("glycosylated_residue", "glyColorSelect")});

	$("#variantColorSelect").change(function() {changeColor("variant", "variantColorSelect")});

	//$("#alphaColorSelect").change(function() {changeColor("alpha");});
	
	//$("#betaColorSelect").change(function() {changeColor("beta");});
	
	//$("#turnColorSelect").change(function() {changeColor("turn");});

	//$("#coiledColorSelect").change(function(){changeColor("coiled");});

	//**********************************************
	//Change symbol of selected element in selector*
	//**********************************************
	// $("#variantSelector").change(function() {
	// 	changeSymbol("variant");
	// });
	// $("#bindingSelector").change(function() {
	// 	changeSymbol("binding");
	// });
	// $("#residueSelector").change(function() {
	// 	changeSymbol("residue");
	// });
	/*************************
	*Checkbox Functions      *
	**************************/
	// $("#domainCheckbox").click(function() {
	// 	$(".domain").toggle(this.checked);
	// });
	$("#domainCheckbox").click(function() {
		checkToggleWithText("domain", "polypeptide domain", "#domainInfoDiv");
	});

	$("#regionCheckbox").click(function() {
		checkToggle("region", "polypeptide region", "#domainPanelRegion");
	});

	$("#repeatCheckbox").click(function() {
		checkToggle("repeat", "polypeptide repeat", "#domainPanelRepeat");
	});

	$("#transmembraneCheckbox").click(function() {
		checkToggle("transmembrane", "transmembrane domain", "#structurePanelTransmembrane");
	});	

	// $("#extramembraneCheckbox").click(function() {
	// 	checkToggle("extramembrane", "extramembrane domain", "#extramembraneInfoDiv");
	// });	

	$("#intramembraneCheckbox").click(function() {
		checkToggle("intramembrane", "intramembrane domain", "#structurePanelIntramembrane");
	});

	// $("#alphaCheckbox").click(function() {
	// 	checkToggle("alpha", "alpha helix structure", "#alphaInfoDiv");
	// });	

	// $("#betaCheckbox").click(function() {
	// 	checkToggle("beta", "beta strand structure", "#betaInfoDiv");
	// });	

	// $("#turnCheckbox").click(function() {
	// 	checkToggle("turn", "turn structure", "#turnInfoDiv");
	// });	

	$("#secondaryCheckbox").click(function() {
		//checkToggle("secondary", "secondary structure", "#structurePanelSecondary");
		checkToggleSecondary();
	});

	$("#coiledCheckbox").click(function() {
		checkToggle("coiled", "coiled coil structure", "#structurePanelCoiled");
	});	

	$("#variantCheckbox").click(function() {
		checkToggle("variant", "variant site", "#variantPanelvariant");
	});

	$("#activeCheckbox").click(function() {
		checkToggle("catalytic_residue", "active site", "#sitePanelActive");
	});

	$("#metalCheckbox").click(function() {
		checkToggle("metal_contact", "metal contact", "#sitePanelMetal");
	});

	$("#bindingCheckbox").click(function() {
		checkToggle("binding_motif", "binding motif", "#sitePanelBinding");
	});

	$("#modifiedCheckbox").click(function() {
		checkToggle("post_translational_modification", "post-trans. modification", "#sitePanelModified");
	});

	$("#lipiCheckbox").click(function() {
		checkToggle("lipoconjugated_residue", "lipidation", "#sitePanelLipi");
	});

	$("#glyCheckbox").click(function() {
		checkToggle("glycosylated_residue", "glycosylation", "#sitePanelGly");
	});




});


//Process read the data in gff file
function process(result) {
		
		loadGff(result);

		//update placeholder in add
		$("#addStart").attr("placeholder", "1 - " + end);
		$("#addEnd").attr("placeholder", "1 - " + end);

		drawCoordinate(start, end);
		if (domainArray.length != 0) {
			drawDomain(domainArray);
			$("#domainCheckbox").attr("checked", true);
		}

		if(repeatArray.length != 0) {
			drawRegion(repeatArray);
			$("#repeatCheckbox").attr("checked", true);
		}

		if (regionArray.length != 0){
			drawRegion(regionArray);
			$("#regionCheckbox").attr("checked", true);
		}

		if (transmembraneArray.length != 0) {
			drawRegion(transmembraneArray);
			$("#transmembraneCheckbox").attr("checked", true);
		}
		
		if(intramembraneArray.length != 0) {
			drawRegion(intramembraneArray);
			$("#intramembraneCheckbox").attr("checked", true);
		}

		if (alphaArray.length != 0) {
			drawRegion(alphaArray);
			$("#secondaryCheckbox").attr("checked", true);
		}
		if (betaArray.length != 0) {
			drawRegion(betaArray);
			$("#secondaryCheckbox").attr("checked", true);
		}
		if (turnArray.length != 0) {
			drawRegion(turnArray);
			$("#secondaryCheckbox").attr("checked", true);
		}
		if (coiledArray.length != 0) {
			drawRegion(coiledArray);
			$("#coiledCheckbox").attr("checked", true);
		}




		if (variantArray.length != 0){
			drawSite(variantArray);
			$("#variantCheckbox").attr("checked", true);
		}

		if (bindingArray.length != 0){
			drawSite(bindingArray);
			$("#bindingCheckbox").attr("checked", true);;
		}

		if (activeArray.length != 0) {
			drawSite(activeArray);
			$("#activeCheckbox").attr("checked", true);;
		}

		if (metalArray.length != 0) {
			drawSite(metalArray);
			$("#metalCheckbox").attr("checked", true);;
		}

		if (modifiedArray.length != 0) {
			drawSite(modifiedArray);
			$("#modifiedCheckbox").attr("checked", true);
		}

		if (lipiArray.length != 0) {
			drawSite(lipiArray);
			$("#lipiCheckbox").attr("checked", true);
		}

		if (glyArray.length != 0) {
			drawSite(glyArray);
			$("glyCheckbox").attr("checked", true);
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
	displayDomainOnPanel(domainArray, "domainPanelDomain");
	displayInfoOnPanel(regionArray, "domainPanelRegion", "region");
	displayInfoOnPanel(repeatArray, "domainPanelRepeat", "repeat");
	displayInfoOnPanel(intramembraneArray, "structurePanelIntramembrane", "intramembrane");
	displayInfoOnPanel(transmembraneArray, "structurePanelTransmembrane", "transmembrane");
	displaySecondaryOnPanel(alphaArray, "structurePanelSecondary", "alpha", "alpha helix");
	displaySecondaryOnPanel(betaArray, "structurePanelSecondary", "beta", "beta sheet");
	displaySecondaryOnPanel(turnArray, "structurePanelSecondary", "turn", "turn");
	displaySecondaryOnPanel(coiledArray, "structurePanelCoiled", "coiled", "coiled coil");
	displayVariantOnPanel(variantArray, "variantPanelvariant", "variant");
	displayVariantOnPanel(activeArray, "sitePanelActive", "site");
	displayVariantOnPanel(metalArray, "sitePanelMetal", "site");
	displayVariantOnPanel(bindingArray, "sitePanelBinding", "site");
	displayVariantOnPanel(modifiedArray, "sitePanelModified", "modified");
	displayVariantOnPanel(lipiArray, "sitePanelLipi", "modified");
	displayVariantOnPanel(glyArray, "sitePanelGly", "modified");

}

//loadGff read info to array
function loadGff(result) {
	
    line = result.split("\n");

    //console.log(line[4]);
    var startRead = 0;
    while (line[startRead][0] == "#" || line[startRead] == "") {
    	
    	if (line[startRead].split(" ")[0] == "##sequence-region") {
    		identifier = line[startRead].split(" ")[1];
    		start = line[startRead].split(" ")[2];
    		end = line[startRead].split(" ")[3];
    	}
    	startRead++;
    }
    itemsNum = 0;


	//itemsArray contains all the items in file
	for (var i = startRead; i < line.length; i++) {
		//Make info (Note and Link) into array
		var infoArray = new Array();
		//console.log(line[i].split("\t")[7]);
		if (line[i]) {

			itemsNum++;
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
				lineId: i-startRead,
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
}

//read itemarray to specific array
function addToArrayByType(item) {
	// var domainArray = new Array();
	if (item.type == "polypeptide_domain"){
		domainArray.push(item);
	}

	else if (item.type == "polypeptide_repeat") {
		repeatArray.push(item);
	}

	// var regionArray = new Array();
	else if (item.type == "polypeptide_region"){
		regionArray.push(item);
	}	

    // transmembraneArray = new Array();
    else if (item.type == "transmembrane") {
    	transmembraneArray.push(item);
    }

	// intramembraneArray = new Array();
	else if (item.type == "intramembrane") {
		intramembraneArray.push(item);
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
	else if (item.type == "binding_motif") {
		bindingArray.push(item);
	}

	else if (item.type == "metal_contact") {
		metalArray.push(item);
	}

	else if (item.type == "catalytic_residue") {
		activeArray.push(item);
	}

	else if (item.type == "post_translational_modification") {
		modifiedArray.push(item);
	}

	else if (item.type == "lipoconjugated residue") {
		lipiArray.push(item);
	}

	else if (item.type == "glycosylated residue") {
		glyArray.push(item);
	}

	else {
		item.other = true;
		others.push(item);
	}
}

//draw the coordinate bar
function drawCoordinate(start, end) {
	var max = parseInt(end/50);
	max = max * 50;
	console.log(max);
	var interval = max/5;
	console.log(interval);
	var pathD = "";
	var rulerD = "";

	for (var i = 1; i <=5; i++) {
		var x = parseInt(svgWidth/end*interval*i);
		var x_ = x+2;
		var c = interval * i;
		var pathD_h = coord_y - 5;
		pathD += " M " + x +" "+pathD_h+" L " + x_ + " "+pathD_h+" ";
		rulerD += " M " + x + " 0 L " + x + " 300 "; 
		var textY = coord_y - 10;
		var coord = makeSVGText('text', {x: x, y: textY, "class": "coordinate"}, c);
		document.getElementById('diagram').appendChild(coord);
	}
	var path = makeSVG('path', {"class": "ruler", d: pathD});
	var ruler = makeSVG('path', {"class": "backGroundRuler", d: rulerD});
	document.getElementById('diagram').appendChild(ruler);
	document.getElementById('diagram').appendChild(path);

}	

function drawDomain(itemsArray) {
	var colorMapKey = 1;
	for (var i =0; i < itemsArray.length; i++) {
		var thisItem = itemsArray[i];

		var domainStart = thisItem.iStart*(svgWidth/end);
		var domainEnd = thisItem.iEnd*(svgWidth/end);
		var domainWidth=domainEnd-domainStart;
		
		var fill;
		var domainInfoLength = thisItem.info[0].content.split(" ").length;
		var lastInfo = domainInfoLength - 1;
		var domainName = thisItem.info[0].content;
		var domainNameFollow = thisItem.info[0].content.split(" ")[lastInfo];
		if (!isNaN(domainNameFollow)) {
			domainName = "";
			for (var j = 0; j < lastInfo; j++) {
				domainName += thisItem.info[0].content.split(" ")[j] + " ";
				
			}

		}

		console.log(domainName);

		
		if (domainName in domainColorMap) {
			fill = domainColorMap[domainName];
		}
		else {
			if (colorMapKey <= 10) {
			//fill = colors[i];
			fill = colorMap[colorMapKey];
			domainColorMap[domainName] = fill;
			colorMapKey++;
			}
			else {
				//fill = colors[i%8];
				fill = colorMap[colorMapKey%10]
				colorMapKey++;
			}

		} 
		
		
		if(thisItem.type=="polypeptide_domain") {
			var domainY = coord_y + 2;
			var domainH = svgHeight -4;
			var svgId = thisItem.lineId+"svg";
			var textId = thisItem.lineId+"text";
			var groupId = thisItem.lineId+ "group";
			var group = makeSVG('g', {id: groupId});
			document.getElementById('diagram').appendChild(group);
			var domain = makeSVG('rect', {x: domainStart, y: domainY, width:domainWidth, height:domainH, id: svgId, fill:fill, "class":"domain"});
			document.getElementById(groupId).appendChild(domain);
			var textX = (domainStart + domainEnd)/2;
			var domainText_y = svgBoxHeight/2+7;
			
			var domainText = makeSVGText('text', {x: textX, y: domainText_y, "font-size": 20, id: textId, "class": "domainText"}, domainName);
			document.getElementById(groupId).appendChild(domainText);
			var textWidth = document.getElementById(textId).getBBox().width;
			if (domainWidth < textWidth) {
				$("#"+textId).css("visibility", "hidden");
			}
			



		}
	}
}

function drawDomainText(itemsArray) {
	for (var i = 0; i < itemsArray.length; i++) {
		var thisItem = itemsArray[i];
		var domainStart = thisItem.iStart*(svgWidth/end);
		var domainEnd = thisItem.iEnd*(svgWidth/end);
		var textId = thisItem.lineId+"text";
		var domainName = thisItem.info[0].content.split(" ")[0];
		var domainNameFollow = thisItem.info[0].content.split(" ")[1]

		if (isNaN(domainNameFollow)) {
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
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 5, id: svgId, "class": "variant"});
			document.getElementById('diagram').appendChild(site);
			// var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline",fill: "white", "text-anchor": "middle", id: textId, "class": "variantText"}, "V");
			// document.getElementById('diagram').appendChild(siteText);
		}
		if (thisItem.type == "metal_contact" || thisItem.type == "binding_motif" || thisItem.type == "catalytic_residue") {
			circle_y = svgBoxHeight/2+5 + 50;
			text_y = circle_y+5;
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 5, id: svgId, "class": thisItem.type});
			document.getElementById('diagram').appendChild(site);
			// var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline",fill: "white", "text-anchor": "middle", id: textId, "class": "bindingText"}, "#");
			// document.getElementById('diagram').appendChild(siteText);
		}
		if (thisItem.type == "post_translational_modification" || thisItem.type == "lipoconjugated residue" || thisItem.type == "glycosylated residue") {
			circle_y = svgBoxHeight/2+5 + 70;
			text_y = circle_y+5;
			var classType = thisItem.type;
			if (classType == "lipoconjugated residue") {
				classType = "lipoconjugated_residue";
			}

			if (classType == "glycosylated residue") {
				classType = "glycosylated_residue";
			}
			var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 5, id: svgId, "class": classType});
			document.getElementById('diagram').appendChild(site);
			// var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline", fill: "white", "text-anchor": "middle", id: textId, "class": "residueText"}, "@");
			// document.getElementById('diagram').appendChild(siteText);

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

		if (thisItem.type == "polypeptide_repeat") {
			var region_y = coord_y+110;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"repeat"});
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

		if (thisItem.type == "transmembrane") {
			var region_y = coord_y+170;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"transmembrane"});
			document.getElementById('diagram').appendChild(region);
		}


		if (thisItem.type == "intramembrane") {
			var region_y = coord_y+170;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"red", "class":"intramembrane"});
			document.getElementById('diagram').appendChild(region);
		}

		if (thisItem.type == "coiled_coil") {
			var region_y = coord_y+200;
			var region_h = svgHeight - 15;
			var region = makeSVG('rect', {x: regionStart, y: region_y, width:regionWidth, height:region_h, id: svgId, fill:"yellow", "class":"coiled"});
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
	var newItem = new Array();
	newItem.push(addItem);
	console.log(addItem.type);
	if (addItem.type == "polypeptide_repeat") {
		displayInfoOnPanel(newItem, domainPanelRepeat, "repeat");
		$("#repeatCheckbox").attr("checked", true);
	}
	if (addItem.type == "polypeptide_region") {
		displayInfoOnPanel(newItem, "domainPanelRegion", "region");
		$("#regionCheckbox").attr("checked", true);
	}
	if (addItem.type == "intramembrane") {
		displayInfoOnPanel(newItem, "structurePanelIntramembrane", "intramembrane");
		$("#intramembraneCheckbox").attr("checked", true);
	}
	if (addItem.type == "transmembrane") {
		displayInfoOnPanel(newItem, "structurePanelTransmembrane", "transmembrane");
		$("#transmembraneCheckbox").attr("checked", true);
	}
	if (addItem.type == "alpha_helix") {
		displaySecondaryOnPanel(newItem, "structurePanelSecondary", "alpha", "alpha helix");
		$("#secondaryCheckbox").attr("checked", true);
	}
	if (addItem.type == "beta_strand") {
		displaySecondaryOnPanel(newItem, "structurePanelSecondary", "beta", "beta sheet");
		$("#secondaryCheckbox").attr("checked", true);
	}
	if (addItem.type == "turn") {
		displaySecondaryOnPanel(newItem, "structurePanelSecondary", "turn", "turn");
		$("#secondaryCheckbox").attr("checked", true);
	}
	if (addItem.type == "coiled_coil") {
		displaySecondaryOnPanel(newItem, "structurePanelCoiled", "coiled", "coiled coil");
		$("#coiledCheckbox").attr("checked", true);
	}
	if (addItem.type == "natural_vairant_site") {
		displayVariantOnPanel(newItem, "variantPanelvariant", "variant");
		$("#variantCheckbox").attr("checked", true);
	}
	if (addItem.type == "catalytic_residue") {
		displayVariantOnPanel(newItem, "sitePanelActive", "site");
		$("#activeCheckbox").attr("checked", true);
	}
	if (addItem.type == "lipoconjugated residue") {
		displayVariantOnPanel(newItem, "sitePanelLipi", "modified");
		$("#lipiCheckbox").attr("checked", true);
	}
	if (addItem.type == "metal_contact") {
		displayVariantOnPanel(newItem, "sitePanelMetal", "site");
		$("#metalCheckbox").attr("checked", true);
	}
	if (addItem.type == "binding_motif") {
		displayVariantOnPanel(newItem, "sitePanelBinding", "site");
		$("#bindingCheckbox").attr("checked", true);
	}
	if (addItem.type == "post_translational_modification") {
		displayVariantOnPanel(newItem, "sitePanelModified", "modified");
		$("#modifiedCheckbox").attr("checked", true);
	}
	if (addItem.type == "glycosylated residue") {
		displayVariantOnPanel(newItem, "sitePanelGly", "modified");
		$("#glyCheckbox").attr("checked", true);
	}

}

function drawItem(item) {
	var thisItem = item;
	var starLocation = thisItem.iStart*(svgWidth/end);
	var circle_y = svgBoxHeight/2+5 + 30;
	var text_y = circle_y+5;
	var svgId = thisItem.lineId+"svg";
	var textId = thisItem.lineId+ "text";
	if (endsWith(thisItem.type, "variant_site")) {
		circle_y = svgBoxHeight/2+5 + 30;
		text_y = circle_y+5;
		var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 5, id: svgId, "class": "variant"});
		document.getElementById('diagram').appendChild(site);
		// var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline",fill: "white", "text-anchor": "middle", id: textId, "class": "variantText"}, "V");
		// document.getElementById('diagram').appendChild(siteText);
	}
	if (thisItem.type == "metal_contact" || thisItem.type == "binding_motif" || thisItem.type == "catalytic_residue") {
		circle_y = svgBoxHeight/2+5 + 50;
		text_y = circle_y+5;
		var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 5, id: svgId, "class": thisItem.type});
		document.getElementById('diagram').appendChild(site);
		// var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline",fill: "white", "text-anchor": "middle", id: textId, "class": "bindingText"}, "#");
		// document.getElementById('diagram').appendChild(siteText);
	}
	if (thisItem.type == "post_translational_modification" || thisItem.type == "lipoconjugated residue" || thisItem.type == "glycosylated residue") {
		circle_y = svgBoxHeight/2+5 + 70;
		text_y = circle_y+5;
		var classType = thisItem.type;
		if (classType == "lipoconjugated residue") {
			classType = "lipoconjugated_residue";
		}

		if (classType == "glycosylated residue") {
			classType = "glycosylated_residue";
		}
		var site = makeSVG('circle', {cx: starLocation, cy: circle_y, r: 5, id: svgId, "class": classType});
		document.getElementById('diagram').appendChild(site);
		// var siteText = makeSVGText('text', {x: starLocation, y: text_y, "font-family": "sans-serif", "font-size": 13,"display": "inline", fill: "white", "text-anchor": "middle", id: textId, "class": "residueText"}, "@");
		// document.getElementById('diagram').appendChild(siteText);

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

function changeColor(thisType, thisColorSelect) {
	var thisColor = $("#"+thisColorSelect).val();
	$("."+thisType).css("fill", thisColor);
	$("#"+thisColorSelect).css("background-color", thisColor);
}

function changeSymbol(thisType) {
	var thisSymbol = $("#"+thisType+"Selector").val();
	$("."+thisType+"Text").text(String(thisSymbol).trim());
}

function checkToggle(thisType, displayName, thisDiv) {
	var thisClass = "."+thisType;
	var thisCheckbox = "#" + thisType + "Checkbox";
	var thisArray = window[thisType+"Array"];

	//$(thisDiv).toggle($(thisCheckbox).checked);
	if ($(thisClass).length != 0) {
		$(thisClass).toggle($(thisCheckbox).checked);

		// $(".itemInfo").toggle(this.checked);
	}

	else {
		// if ($(thisCheckbox).checked) {
		// 	console.log(thisDiv);
		// 	$(thisDiv).append('<span class="alertMessage"> There is no'+displayName+ 'in this query.</span></br>');
		// }
		$(thisDiv).html('<span class="alertMessage"> There is no '+displayName+ ' in this query.</span></br>');
	}
}

function checkToggleSecondary() {
	if ($(".alpha").length != 0) {
		$(".alpha").toggle($("#secondaryCheckbox").checked);
	}
	if ($(".beta").length != 0) {
		$(".beta").toggle($("#secondaryCheckbox").checked);
	}
	if ($(".turn").length != 0) {
		$(".turn").toggle($("#secondaryCheckbox").checked);
	}
	if ($(".alpha").length == 0 && $(".beta").length == 0 && $(".turn").length == 0) {
		$("#structurePanelSecondary").html('<span class="alertMessage"> There is no secondary structure in this query.</span></br>');
	}
}


function checkToggleWithText(thisType, displayName, thisDiv) {
	var thisClass = "."+thisType;
	var thisCheckbox = "#" + thisType + "Checkbox";
	var thisArray = window[thisType+"Array"];
	var thisText = "."+thisType+ "Text";
	
	if (thisArray.length != 0) {
		$(thisClass).toggle($(thisCheckbox).checked);
		$(thisText).toggle($(thisCheckbox).checked);
		// displayInfoOnRight(thisArray, "#siteInfoDiv");
		// $(".itemInfo").toggle(this.checked);
	}

	else {
		$(thisDiv).html('<span class="alertMessage"> There is no '+displayName+ ' in this query.</span></br>');
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
		// console.log(divType);
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
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + thisId).mouseout(function() {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length - 4;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
			//svg.removeChild(svg.lastChild);
		});
	}
}


function displayDomainOnPanel(domainArray, panelDiv) {
	for (var i = 0; i < domainArray.length; i++) {
		var domainInfoLength = domainArray[i].info[0].content.split(" ").length;
		var lastInfo = domainInfoLength - 1;
		var domainName = domainArray[i].info[0].content;
		var domainNameFollow = domainArray[i].info[0].content.split(" ")[lastInfo];
		if (!isNaN(domainNameFollow)) {
			domainName = "";
			for (var j = 0; j < lastInfo; j++) {
				domainName += domainArray[i].info[0].content.split(" ")[j] + " ";
				
			}

		}

		var thisRange = "["+ domainArray[i].iStart + " --> " + domainArray[i].iEnd+"] ";
		var displayDomainName = domainArray[i].info[0].content;
		var span = "<span class=\"itemInfo\" id=\"" + domainArray[i].lineId+ "panel\"> " + thisRange + displayDomainName + "</span></br>";
		$("#" + panelDiv).append(span);
		var thisId = domainArray[i].lineId + "panel";
		$("#" + thisId).css("background-color", domainColorMap[domainName]);
		
		$("#" + thisId).mouseover(function () {
			$(this).css("color", "red");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-5;
		    var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "red");
			$("#" + svgid).attr("stroke-width", 3);
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + thisId).mouseout(function() {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length - 5;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
			//svg.removeChild(svg.lastChild);
		});
		

		$("#" + domainArray[i].lineId + "svg").mouseover(function () {
			console.log("touched");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "red");
			$(this).attr("stroke-width", 3);
			$("#" + spanId).css("color", "red");
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + domainArray[i].lineId + "svg").mouseout(function() {
			
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "none");
			$(this).attr("stroke-width", 0);
			$("#" + spanId).css("color", "black");
			//svg.removeChild(svg.lastChild);
		});
	}
}

function displayInfoOnPanel(array, panelDiv, thisClass) {
	for (var i = 0; i < array.length; i++) {
		var infoLength = array[i].info.length;
		var displayInfo = "";
		for (var j = 0; j < infoLength; j ++) {
			if (array[i].info[j].type == "Note") {
				displayInfo += array[i].info[j].content+ " ";
			}
		}
		
		var thisRange = "["+ array[i].iStart + " --> " + array[i].iEnd+"] ";
		var span = "<span class=\"itemInfo\" id=\"" + array[i].lineId+ "panel\"> " + thisRange + displayInfo + "</span></br>";
		$("#" + panelDiv).append(span);
		var thisId = array[i].lineId + "panel";
		// $("#" + thisId).css("background-color", $("."+thisClass).css("backgroundColor"));
		$("#" + thisId).mouseover(function () {
			$(this).css("color", "red");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-5;
		    var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "red");
			$("#" + svgid).attr("stroke-width", 3);
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + thisId).mouseout(function() {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length - 5;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
			//svg.removeChild(svg.lastChild);
		});

		$("#" + array[i].lineId + "svg").mouseover(function () {
			console.log("touched");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "red");
			$(this).attr("stroke-width", 3);
			$("#" + spanId).css("color", "red");
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + array[i].lineId + "svg").mouseout(function() {
			
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "none");
			$(this).attr("stroke-width", 0);
			$("#" + spanId).css("color", "black");
			//svg.removeChild(svg.lastChild);
		});

	}
}

function displaySecondaryOnPanel(array, panelDiv, thisClass, formalType) {
	for (var i = 0; i < array.length; i++) {
		var infoLength = array[i].info.length;
		var displayInfo = formalType;
		for (var j = 0; j < infoLength; j ++) {
			if (array[i].info[j].type == "Note") {
				displayInfo += ", "+array[i].info[j].content+ " ";
			}
		}
		
		var thisRange = "["+ array[i].iStart + " --> " + array[i].iEnd+"] ";
		var span = "<span class=\"itemInfo\" id=\"" + array[i].lineId+ "panel\"> " + thisRange + displayInfo + "</span></br>";
		$("#" + panelDiv).append(span);
		var thisId = array[i].lineId + "panel";
		// $("#" + thisId).css("background-color", $("."+thisClass).css("backgroundColor"));
		$("#" + thisId).mouseover(function () {
			$(this).css("color", "red");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-5;
		    var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "red");
			$("#" + svgid).attr("stroke-width", 3);
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + thisId).mouseout(function() {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length - 5;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
			//svg.removeChild(svg.lastChild);
		});

		$("#" + array[i].lineId + "svg").mouseover(function () {
			console.log("touched");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "red");
			$(this).attr("stroke-width", 3);
			$("#" + spanId).css("color", "red");
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + array[i].lineId + "svg").mouseout(function() {
			
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "none");
			$(this).attr("stroke-width", 0);
			$("#" + spanId).css("color", "black");
			//svg.removeChild(svg.lastChild);
		});

	}
}

function displayVariantOnPanel(array, panelDiv, thisClass) {
	for (var i = 0; i < array.length; i++) {
		var infoLength = array[i].info.length;
		var displayInfo = "";
		var more = "";
		var moreInfoLink = ""; 
		for (var j = 0; j < infoLength; j ++) {
			if (array[i].info[j].type == "Note") {
				displayInfo += array[i].info[j].content+ ", ";
			}
			if (array[i].info[j].type == "Link") {
				moreInfoLink = array[i].info[j].content;
			}
		}

		if (moreInfoLink != "") {
			more = "<a target=\"_tab\" href=\"" + moreInfoLink + "\"> more </a>";
		}
		
		var thisRange = "["+ array[i].iStart + "] ";
		var span = "<span class=\"itemInfo\" id=\"" + array[i].lineId+ "panel\"> " + thisRange + displayInfo + more+"</span></br>";
		$("#" + panelDiv).append(span);
		var thisId = array[i].lineId + "panel";
		// $("#" + thisId).css("background-color", $("."+thisClass).css("backgroundColor"));
		$("#" + thisId).mouseover(function () {
			$(this).css("color", "red");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-5;
		    var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "red");
			$("#" + svgid).attr("stroke-width", 3);
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + thisId).mouseout(function() {
			$(this).css("color", "black");
			var thisid = $(this).attr("id");
			thisid = String(thisid);

			var subEnd = thisid.length - 5;
			var svgid = thisid.substring(0, subEnd) + "svg";
			$("#" + svgid).attr("stroke", "none");
			$("#" + svgid).attr("stroke-width", 0);
			//svg.removeChild(svg.lastChild);
		});

		$("#" + array[i].lineId + "svg").mouseover(function () {
			console.log("touched");
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "red");
			$(this).attr("stroke-width", 3);
			$("#" + spanId).css("color", "red");
			//svg.appendChild(document.getElementById(svgid));

		});
		$("#" + array[i].lineId + "svg").mouseout(function() {
			
			var thisid = $(this).attr("id");
			thisId = String (thisid);
			var subEnd = this.id.length-3;
		    var spanId = thisid.substring(0, subEnd) + "panel";
			$(this).attr("stroke", "none");
			$(this).attr("stroke-width", 0);
			$("#" + spanId).css("color", "black");
			//svg.removeChild(svg.lastChild);
		});

	}
}

