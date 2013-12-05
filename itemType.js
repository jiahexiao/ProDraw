var typeArray = new Array();
var typeArray_in_999_files = ["cleaved_initiator_methionine", "mature_protein_region", 
							"metal_contact", "binding_motif", "post_translational_modification", 
							"alpha_helix", "turn", "beta_strand", "natural_variant_site", 
							"disulfide crosslinked residues", "sequence_uncertainty", "sequence_conflict", 
							"mutated_variant_site", "signal_peptide", "polypeptide_domain", "propeptide", 
							"compositionally_biased_region", "transit_peptide", "transmembrane", 
							"polypeptide_region", "alternative_sequence_site", "non_terminal_residue", 
							"catalytic_residue", "active_peptide", "glycosylated residue", "polypeptide_motif", 
							"crosslinked residues", "lipoconjugated residue", "extramembrane", 
							"Natural non-standard encoded residue", "polypeptide_repeat", "coiled_coil"]
$("#getType").click(function() {
	for (var i = 1; i <=9; i++) {
		var str = "" + i;
		var pad = "00000";
		var identifier = pad.substring(0, pad.length - str.length) + str;
		url = "http://websitescraper.heroku.com/?url=http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/P"+identifier+"/gff2";
		urlpass = url + "?s=RIL.BO&callback=?";
		$.getJSON(urlpass, function(result) {
			loadGfff(result);
		});	

		// $.ajax({
  // 			dataType: "json",
  // 			url: urlpass,
  // 			async: false,
  // 			success: function(result) {
		// 		loadGfff(result);
		// 		// console.log(typeArray);
		// 	}
		// });
		
	}
	console.log(typeArray);
});

function loadGfff(result) {
    line = result.split("\n");


    var startRead = 0;
    while (line[startRead][0] == "#" || line[startRead] == "") {
    	startRead++;
    }
	//itemsArray contains all the items in file
	for (var i = startRead; i < line.length-1; i++) {
		var infoArray = new Array();
		var item = {
			lineId: i-4,
			type: line[i].split("\t")[2],
			iStart: line[i].split("\t")[3],
			iEnd: line[i].split("\t")[4],
			info: infoArray
		};

		var has = 0;

		for (var j = 0; j < typeArray.length; j++) {
			if(typeArray[j] == item.type) {
				has = 1;
			}
		}

		if (has == 0) {
			typeArray.push(item.type);
		}
	}
}