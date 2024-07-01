var datePicker = $('input[name="datePeriod"]').daterangepicker();
var dateStart = $('#iptDateStart').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true
}, function(start, end, label) {
    datePicker.data('daterangepicker').setStartDate(start.format('MM/DD/YYYY'));
});
var dateEnd = $('#iptDateEnd').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true
}, function(start, end, label) {
    datePicker.data('daterangepicker').setEndDate(end.format('MM/DD/YYYY'));
});
// function getTZDate(sDate) {
    //var str = new dayjs(sDate).tz("America/New_York").format('MM/DD/YYYY');
    /**
     * since the datetime in database table stats is already "America/New_York",
     * so we don't need to convert it specially.
     */
//    var str = new dayjs(sDate).format('MM/DD/YYYY');
//    return str;
// }
function drillDown(sDate) {
    //var str = getTZDate(sDate);
    datePicker.data('daterangepicker').setStartDate(sDate);
    datePicker.data('daterangepicker').setEndDate(sDate);
    dateStart.data('daterangepicker').setStartDate(sDate);
    dateEnd.data('daterangepicker').setStartDate(sDate);
    $("#rdioViewByOffice").click();
    $("#formLoadStats").submit();
}
function drillDownOffi(id) {
    $("#selOffice").val(id);
    $("#rdioViewByAgent").click();
    $("#formLoadStats").submit();
}
function drillDownAgent(id) {
    $("#selAgent").val(id);
    $("#rdioViewByDetail").click();
    $("#formLoadStats").submit();
}
    
$(document).ready(function() {
    var post_params = JSON.parse($("#iptPost_params").val());
    //console.log(`[debug from stats.pug.js(0):]${JSON.stringify(post_params)}`)
    if (JSON.stringify(post_params) !== "{}" && JSON.stringify(post_params) !== "") {
        $("#selSite option[value='" + post_params.selSite + "']").attr("selected", "selected");
        //type ....... undergoing
        $("#selOffice option[value='" + post_params.selOffice + "']").attr("selected", "selected");
        $("#selAgent option[value='" + post_params.selAgent + "']").attr("selected", "selected");

        $("#iptViewBy").val((typeof(post_params) !== undefined && post_params !== "") ? post_params.iptViewBy : 'detail');
        switch (post_params.iptViewBy) {
            case 'detail':
                $("#rdioViewByDetail").attr("checked", "checked");
                break;
            case 'agent':
                $("#rdioViewByAgent").attr("checked", "checked");
                break;
            case 'office':
                $("#rdioViewByOffice").attr("checked", "checked");
                break;
            case 'day':
            $("#rdioViewByDay").attr("checked", "checked");
            break;
        }
    }
    var caption = (post_params !== "" ? "<u class='me-2'>From " + post_params.datePeriod.replace("-", "To") + "</u>" : "");
    var _site = (caption != "" ? (post_params.selSite != -111 ? ("Site:"+ $("#selSite option[value='" + post_params.selSite + "']").text()) : "Site:All") : "Site:All");
    var _type = (caption != "" ? (post_params.selType != -111 ? ("Type:"+ post_params.selType) : "Type:All") : "Type:All");
    var _office = (caption != "" ? (post_params.selOffice != -111 ? ("Office:"+ $("#selOffice option[value='" + post_params.selOffice + "']").text()) : "Office:All") : "Office:All");
    var _agent = (caption != "" ? (post_params.selAgent != -111 ? ("Agent:"+ $("#selAgent option[value='" + post_params.selAgent + "']").text()) : "Agent:All") : "Agent:All");
    caption += "[" + (_site != "" ? _site : "") + "," + (_type != "" ? _type : "");
    caption += "," + (_office != "" ? _office : "") + "," + (_agent != "" ? _agent : "") + "]";
    caption = '<i class="bi bi-calendar2-week fs-6 me-1"></i>' + caption;
    $("#divCaption").html(caption);

    if (post_params == "") {
        $("#selPeriod")[0].selectedIndex = 3;
        //console.log("[debug from stats.pug.js(1):]" + $("#selPeriod").val());
        setDatePicker();
        //$("#iptLoadReport").click();
    } else {
        $("#datePeriod").val(post_params.datePeriod);
        let dates = post_params.datePeriod.split("-");
        dates[0] = dates[0].replace(" ", "");
        dates[1] = dates[1].replace(" ", "");
        datePicker.data('daterangepicker').setStartDate(dates[0]);
        datePicker.data('daterangepicker').setEndDate(dates[1]);
        dateStart.data('daterangepicker').setStartDate(dates[0]);
        dateEnd.data('daterangepicker').setStartDate(dates[1]);
    }
    /*
    $('[name="uDateStr"]').each(function() {
        $(this).html(getTZDate($(this).html()));
    });
    $('[name="aDay"]').each(function() {
        $(this).html(getTZDate($(this).html()));
    });
    */
});

$("#formLoadStats").validate({
    errorClass: 'text-danger',
    rules: {
        selSite: {
            required: true,
        },
        selAgent: {
            required: true,
        }
    },
    message: {
        //
    }
})

$('#selOffice').on("change", function() {
    //alert($('#selOffice').val());
    $.ajax({
        url: "ags_nov",
        type: "post",
        data: {officeid: $('#selOffice').val()},
        dataType: "json",
        success: function(rst) {
            $('#selAgent').html("<option value='-111'>All</option>");
            let agents = $.parseJSON(rst.rst);
            for (let agent of agents) {
                $('#selAgent').html($('#selAgent').html() 
                    + "<option value='" + agent.id + "'>" + agent.username + "</option>");
            }
            //console.log("[debug from links page of ajax:]"); console.log(rst); console.log(agents);// debug;
        }
    })
})

var selPeriod =$('#selPeriod');
var now = moment(), yesterday = moment().subtract(1, 'day');
selPeriod.append("<option value='" + now.format("MM/DD/YYYY") + "," + now.format("MM/DD/YYYY") + "'>Today</option>");
selPeriod.append("<option value='" + yesterday.format("MM/DD/YYYY") + "," + yesterday.format("MM/DD/YYYY") + "'>Yesterday</option>");
var weekstart = moment().day(0), weekend = moment().day(0).add(6, 'day');
selPeriod.append("<option value='" + weekstart.format("MM/DD/YYYY") + "," + weekend.format("MM/DD/YYYY") + "'>This week</option>");
selPeriod.append("<option value='" + weekstart.subtract(6, 'day').format("MM/DD/YYYY") + "," + weekend.subtract(6, 'day').format("MM/DD/YYYY") + "'>Last week</option>");
var monstart = moment().year(moment().year()).month(moment().month()).date(1), monend = moment(monstart).add(1, 'month').subtract(1, 'day');
selPeriod.append("<option value='" + monstart.format("MM/DD/YYYY") + "," + monend.format("MM/DD/YYYY") + "'>This Month</option>");
monstart = monstart.subtract(1, 'month'); monend = moment(monstart).add(1, 'month').subtract(1, 'day');
selPeriod.append("<option value='" + monstart.format("MM/DD/YYYY") + "," + monend.format("MM/DD/YYYY") + "'>Last Month</option>");
var yearstart = moment().month(0).date(1), yearend = moment(yearstart).add(1, 'year').subtract(1, 'day');
selPeriod.append("<option value='" + yearstart.format("MM/DD/YYYY") + "," + yearend.format("MM/DD/YYYY") + "'>This Year</option>");
yearstart = yearstart.subtract(1, 'year'); yearend = moment(yearstart).add(1, 'year').subtract(1, 'day');
selPeriod.append("<option value='" + yearstart.format("MM/DD/YYYY") + "," + yearend.format("MM/DD/YYYY") + "'>Last Year</option>");
for (let i = 0; i < 10; i++) {
    var ws = weekstart.subtract(6, 'day').format("MM/DD/YYYY");
    var we = weekend.subtract(6, 'day').format("MM/DD/YYYY")
    selPeriod.append("<option value='" + ws + "," + we + "'>[week]" + ws + " to " + we + "</option>");
}
for (let i = 0; i < 11; i++) {
    var ms = monstart.subtract(1, 'month').format("MM/DD/YYYY");
    var me = moment(monstart).add(1, 'month').subtract(1, 'day').format("MM/DD/YYYY");
    selPeriod.append("<option value='" + ms + "," + me + "'>[month]" + ms + " to " + me + "</option>");
}
//$("#selPeriod")[0].selectedIndex = 3;
//setDatePicker();

function setDatePicker() {
    let dates = $('#selPeriod').val().split(",");
    datePicker.data('daterangepicker').setStartDate(dates[0]);
    datePicker.data('daterangepicker').setEndDate(dates[1]);
    dateStart.data('daterangepicker').setStartDate(dates[0]);
    dateEnd.data('daterangepicker').setStartDate(dates[1]);
}

$('#selPeriod').click(function() {
    if ($('#selPeriod').prop('selectedIndex') != 0) {
        setDatePicker();
    }
})

$('#tblStats').tablemanager({
    pagination: true,
    //numOfPages: "8",
    //disable: [1, 10, "last"]
});