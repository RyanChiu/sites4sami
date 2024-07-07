var dateStart_clog = $('#iptDateStart_clog').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true
}, function(start, end, label) {
    if ($('#iptDateStart_clog').val() == "")
        dateStart_clog.data('daterangepicker').setStartDate(start.format('MM/DD/YYYY'));
});
var dateEnd_clog = $('#iptDateEnd_clog').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true
}, function(start, end, label) {
    if ($('#iptDateEnd_clog').val() == "")
        dateEnd_clog.data('daterangepicker').setEndDate(end.format('MM/DD/YYYY'));
});
$('#tblLogs').tablemanager({
    pagination: true,
    //numOfPages: "8",
    //disable: [1, 10, "last"]
});

$('#tblHitlogs').tablemanager1({
    pagination: true,
    //numOfPages: "8",
    disable: [6, "last"]
});

$('[name="uLinkin"]').each(function() {
    var linkin = window.location.href.replace("logs", "nav2?to=") + $(this).html();
    var html = '<a href="#" onclick="alert(\'' + linkin + '\');return false;">' 
        + '<i class="bi bi-link text-info"></i>' 
        + '</a>';
    $(this).html(html);
});
/*
$("#login-tab").click(function() {
    alert("login-tab");
})

$("#hit-tab").click(function() {
    alert("hit-tab");
})
*/