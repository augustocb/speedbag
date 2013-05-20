$(window).ready(function() {
	if ($('meta[name=vtex-version]').length > 0) {
		$.skuSelector("popup");
	}
});

$(document).ajaxStop(function() {
	if ($('meta[name=vtex-version]').length > 0) {
		$.skuSelector.bindClickHandlers("btn-add-buy-button-asynchronous");
	}
});
