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
$('#selOffice_clog').on("change", function() {
    $.ajax({
        url: "ags_nov",
        type: "post",
        data: {officeid: $('#selOffice_clog').val()},
        dataType: "json",
        success: function(rst) {
            $('#selAgent_clog').html("<option value='-111'>All</option>");
            let agents = $.parseJSON(rst.rst);
            for (let agent of agents) {
                $('#selAgent_clog').html($('#selAgent_clog').html() 
                    + "<option value='" + agent.id + "'>" + agent.username + "</option>");
            }
            //console.log("[debug from links page of ajax:]"); console.log(rst); console.log(agents);// debug;
        }
    })
})
setPeriodsPicks("#selPeriod_clog", dateStart_clog, dateEnd_clog);
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

function setLinksModal(title, links) {
    $("#h3LinksTitle").html(title);
    $("#divLinkIn").html(links[0]);
    if ($("#divLinkOut") !== undefined) $("#divLinkOut").html(links[1]);
}
$('[name="uLinkin"]').each(function() {
    var title = "Agent: " + $(this).data("agent") + "  Alias: " + $(this).data("alias");
    var linkin = window.location.href.replace("logs", "nav2?to=") + $(this).html();
    var linkout = $(this).data("linkout");
    var html = '<a href="#" onclick="setLinksModal(\'' + title + '\', [\'' + linkin + '\', \'' + linkout + '\']);' + '$(\'#btnShowLinks\').click();' + 'return false;">' 
    //var html = '<a href="#foo" onclick="$(\'#btnShowLinks\').click();' + 'return false;">'
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
