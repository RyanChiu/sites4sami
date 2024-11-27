function testFun() {
    alert("This is a test call.");
}
function setPeriods(selId) {
    var selPeriod =$(selId);
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
}
function setPeriodsPicks(selId, iptStart, iptEnd) {
    setPeriods(selId);
    $(selId).click(function() {
        let dates = $(this).val().split(",");
        if ($(this).prop('selectedIndex') != 0) {
            iptStart.data('daterangepicker').setStartDate(dates[0]);
            iptEnd.data('daterangepicker').setStartDate(dates[1]);
        }
    });
}
function copy2Clipboard(lnkId, iptId) {
    new ClipboardJS("#" + lnkId, {
        text: function(trigger) {
            return $("#" + iptId).val();
        }
    }).on('success', function(e) {
        console.log(`[debug (suc)]`);
    }).on('error', function(e) {
        console.log(`[debug (failed)]`);
    });
}
