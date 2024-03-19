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

$('#selPeriod').click(function() {
    dates = $('#selPeriod').val().split(",");
    datePicker.data('daterangepicker').setStartDate(dates[0]);
    datePicker.data('daterangepicker').setEndDate(dates[1]);
})