$(document).ready(function() {
    $("#captchaImg").click(function(){
        d = new Date();
        this.src = "captcha" + "?" + d.getTime();
    })

    $("#formAgentDwit").validate({
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

    // format all the time strings in tds or other components with the same name 'uTimeStr'
    dayjs.extend(window.dayjs_plugin_utc);
    dayjs.extend(window.dayjs_plugin_timezone);
    $('[name="uTimeStr"]').each(function() {
        var str = new dayjs($(this).html()).tz("America/New_York").format('DD/MM/YYYY HH:mm:ss');
        $(this).html(str)
    })
    // format a status into a reffered icon in tds or other components with the same name 'uStatus'
    $('[name="uStatus"]').each(function() {
        $(this).addClass("fs-4 pt-1 pb-0");
        let status = $(this).html();
        switch (status) {
            case "-1":
                $(this).html("<i class='bi bi-person-slash text-danger'></i>");
                break;
            case "0":
                $(this).html("<i class='bi bi-person-exclamation text-warning'></i>");
                break;
            case "1":
                $(this).html("<i class='bi bi-person-check text-success'></i>");
                break;
            default:
                $(this).html("-");
        }
    })

    // theme all the table
    $('table').each(function() {
        $(this).addClass("table table-dark table-striped table-borderless");
    })
    $('thead').each(function() {
        $(this).addClass("table-primary");
    })
});