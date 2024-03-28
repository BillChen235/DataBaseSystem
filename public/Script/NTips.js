document.write("<script src='\/Script\/jquery.poshytip.js'><\/script>");
function bindFocusTips(elem, text){
	if(!$(this).data("poshytip"))
		unbindFocusTips(elem);
	var $elem = $(elem);
	$elem.poshytip({
		showOn: "none",
		content: text,
		alignTo: "target",
		alignX: "right",
		alignY: "center",
		offsetX: 5
	});
	$elem.on("focus", function(){
		$(elem).poshytip("show");
	}).on("blur", function(){
		$(elem).poshytip("hide");
	});
}
function bindClickDestroyTips(elem, text){
	if(!$(this).data("poshytip"))
		unbindFocusTips(elem);
	var $elem = $(elem);
	$elem.poshytip({
		showOn: "none",
		content: text,
		alignTo: "target",
		alignX: "right",
		alignY: "center",
		offsetX: 5
	});
	$elem.poshytip("show");
	$elem.on("click", function(){
		if($(this).data("poshytip"))// See if it is initialized 
			unbindFocusTips(elem);
	});
}
function unbindFocusTips(elem){
	$(elem).poshytip("destroy");
}