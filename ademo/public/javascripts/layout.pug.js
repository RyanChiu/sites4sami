$(document).ready(function() {
    $("#captchaImg").click(function(){
        d = new Date();
        this.src = "captcha" + "?" + d.getTime();
    })

    $("#formAddAgent").validate({
        rules: {
            ipt1stName: "required",
            iptLstName: "required",
            iptUsername: {
                required: true,
                minlength: 3
            },
            iptPassword: {
                required: true,
                minlength: 5
            },
            iptPassword2: {
                required: true,
                minlength: 5,
                equalTo: "#iptPassword"
            }
        },
        message: {
            //
        }
    });

    $("#formAddOffice").validate({
        rules: {
            ipt1stName: "required",
            iptLstName: "required",
            iptUsername: {
                required: true,
                minlength: 3
            },
            iptPassword: {
                required: true,
                minlength: 5
            },
            iptPassword2: {
                required: true,
                minlength: 5,
                equalTo: "#iptPassword"
            }
        },
        message: {
            //
        }
    });

    // format all the time strings with the same 'name'
    dayjs.extend(window.dayjs_plugin_utc);
    dayjs.extend(window.dayjs_plugin_timezone);
    $('[name="uTimeStr"]').each(function() {
        var str = new dayjs($(this).html()).tz("America/New_York").format('DD/MM/YYYY HH:mm:ss');
        $(this).html(str)
    })

    // theme all the table
    $('table').each(function() {
        $(this).addClass("table table-dark table-striped table-borderless");
    })
    $('thead').each(function() {
        $(this).addClass("table-primary");
    })
});