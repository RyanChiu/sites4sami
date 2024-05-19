$(document)
    .ajaxStart(function() {
        $('#btnStartLoading').click();
    })
    .ajaxStop(function() {
        $('#btnEndLoading').click();
    })