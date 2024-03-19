$(document)
    .ajaxStart(function() {
        $('#btnStartLoading').click();
        //$('#btnLoading').removeClass("d-none");
        //$('#selAgent').addClass("d-none");
        //console.log("ajax request starts"); //debug
    })
    .ajaxStop(function() {
        $('#btnEndLoading').click();
        //$('#btnLoading').addClass("d-none");
        //$('#selAgent').removeClass("d-none");
        //console.log("ajax request ends"); //debug
    })

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
                    + "<option value='" + agent.username + "'>" + agent.username + "</option>");
            }
            //console.log("[debug from links page of ajax:]"); console.log(rst); console.log(agents);// debug;
        }
    })
})

var datePicker = $('input[name="datePeriod"]').daterangepicker({
    startDate: moment(),
    endDate: moment().subtract(7, 'day')
});

var selPeriod =$('#selPeriod');
var now = moment(), yesterday = moment().subtract(1, 'day');
selPeriod.append("<option value='" + now.format("MM/DD/YYYY") + "," + now.format("MM/DD/YYYY") + "'>Today</option>");
selPeriod.append("<option value='" + yesterday.format("MM/DD/YYYY") + "," + yesterday.format("MM/DD/YYYY") + "'>Yesterday</option>");
var weekstart = moment().day(0), weekend = moment().day(0).add(6, 'day');
selPeriod.append("<option value='" + weekstart.format("MM/DD/YYYY") + "," + weekend.format("MM/DD/YYYY") + "'>This week</option>");
selPeriod.append("<option value='" + weekstart.subtract(7, 'day').format("MM/DD/YYYY") + "," + weekend.subtract(7, 'day').format("MM/DD/YYYY") + "'>Last week</option>");
var monstart = moment().year(moment().year()).month(moment().month()).date(1), monend = moment(monstart).add(1, 'month').subtract(1, 'day');
selPeriod.append("<option value='" + monstart.format("MM/DD/YYYY") + "," + monend.format("MM/DD/YYYY") + "'>This Month</option>");
monstart = monstart.subtract(1, 'month'); monend = moment(monstart).add(1, 'month').subtract(1, 'day');
selPeriod.append("<option value='" + monstart.format("MM/DD/YYYY") + "," + monend.format("MM/DD/YYYY") + "'>Last Month</option>");
var yearstart = moment().month(0).date(1), yearend = moment(yearstart).add(1, 'year').subtract(1, 'day');
selPeriod.append("<option value='" + yearstart.format("MM/DD/YYYY") + "," + yearend.format("MM/DD/YYYY") + "'>This Year</option>");
yearstart = yearstart.subtract(1, 'year'); yearend = moment(yearstart).add(1, 'year').subtract(1, 'day');
selPeriod.append("<option value='" + yearstart.format("MM/DD/YYYY") + "," + yearend.format("MM/DD/YYYY") + "'>Last Year</option>");
for (let i = 0; i < 10; i++) {
    var ws = weekstart.subtract(7, 'day').format("MM/DD/YYYY");
    var we = weekend.subtract(7, 'day').format("MM/DD/YYYY")
    selPeriod.append("<option value='" + ws + "," + we + "'>[week]" + ws + " to " + we + "</option>");
}
for (let i = 0; i < 11; i++) {
    var ms = monstart.subtract(1, 'month').format("MM/DD/YYYY");
    var me = moment(monstart).add(1, 'month').subtract(1, 'day').format("MM/DD/YYYY");
    selPeriod.append("<option value='" + ms + "," + me + "'>[month]" + ms + " to " + me + "</option>");
}

$('#selPeriod').click(function() {
    dates = $('#selPeriod').val().split(",");
    datePicker.data('daterangepicker').setStartDate(dates[0]);
    datePicker.data('daterangepicker').setEndDate(dates[1]);
})