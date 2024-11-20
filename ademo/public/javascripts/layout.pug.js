function setuStatusIcon(element) {
    $(element).addClass("fs-4 pt-1 pb-0");
        let status = $(element).html();
        switch (status) {
            case "-1":
                $(element).html("<i class='bi bi-person-slash fs-5 text-danger'>(hidden)</i>");
                break;
            case "0":
                $(element).html("<i class='bi bi-person-exclamation fs-5 text-warning'>(deactivated)</i>");
                break;
            case "1":
                $(element).html("<i class='bi bi-person-check fs-5' style='color:#A8D61B'>(activated)</i>");
                break;
            default:
                $(element).html("-");
        }
}
function setuStatusIcons() {
    $('[name="uStatus"]').each(function() {
        setuStatusIcon(this);
    })
}

function _zShowClock() {
    var now = new Date();
    // now.setHours(now.getHours() - 4);
    var nowStr;
    const options = {
      timeZone: 'America/New_York', timeZoneName: 'short',
      day: '2-digit', month: 'short', year: 'numeric', weekday: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    nowStr = formatter.format(now);
    /*
    nowStr = now.toUTCString();
    nowStr = nowStr.replace("GMT", "EDT"); //for firefox browser
    nowStr = nowStr.replace("UTC", "EDT"); //for IE browser
    */
    nowStr = '<i class="bi bi-clock-fill fs-3 text-light me-1"></i>' + nowStr;
    jQuery("#lblLiveClock").html(nowStr);
}
function __zShowClock() {
    _zShowClock();
    setTimeout("__zShowClock()", 1000);
}
__zShowClock();

$(document).ready(function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})
	// tell every page that the counts of the agents who need to be approved is stored in session
    if (sessionStorage.getItem("newags") == "" || sessionStorage.getItem("newags") == undefined || sessionStorage.getItem("newags") == null) {
        sessionStorage.setItem("newags", $("#iptNewAgs").val());
    } else {
        // show nums on top corner of the nav item
        // $("#navLnk_approveagents").text("*New*" + sessionStorage.getItem("newags"));
        $("#navLnk_approveagents").append(
            '<span id="spnNewAgs" class="top-0 start-0 m-0 translate-middle badge rounded-pill bg-danger float-sm-end" style="font-size:8px;">'
                + '<label class="p-0 m-0 text-light" id="lblNewAgs">'
                + sessionStorage.getItem("newags")
                + '</label>'
                + '<span class="visually-hidden m-0">unapproved agent(s)</span>'
            + '</span>'
        );
        if (sessionStorage.getItem("newags") == 0) {
            $("#spnNewAgs").hide();
        } else {
            $("#spnNewAgs").show();
        }
    }
    //alert($("#navLnk_approveagents").text());
    //alert(sessionStorage.getItem("newags"));
    var hideNav = $("#iptHideNav").val();
    var poped = sessionStorage.getItem("poped");
    if (hideNav == 0) {
        poped = (poped == null || poped == "false" ? "false" : "true");
        sessionStorage.setItem("poped", "true");
        // to do: put popup box for the alerts below
        if (poped == "false") $("#btnPopup").click();
    } else {
        poped = (poped == null ? false: poped);
        sessionStorage.setItem("poped", "false");
    }

    $("#captchaImg").click(function(){
        d = new Date();
        this.src = "captcha" + "?" + d.getTime();
    })

    $("#formAgentDwit").validate({
        errorClass: 'text-danger',
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

    $("#formOfficeDwit").validate({
        errorClass: 'text-danger',
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

    $("#formAdminDwit").validate({
        errorClass: 'text-danger',
        rules: {
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

    $("#formProfile").validate({
        errorClass: 'text-danger',
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
        var dt = new dayjs($(this).html());
        var str = null;
        if (dt.isValid()) {
            str = dt.tz("America/New_York").format('MM/DD/YYYY HH:mm:ss');
        } else {
            str = "-";
        }
        $(this).html(str)
    })
    // format a status into a reffered icon in tds or other components with the same name 'uStatus'
    setuStatusIcons();
    // format a status into a reffered icon in tds or other components with the same name 'sStatus'
    $('[name="sStatus"]').each(function() {
        $(this).addClass("fs-5 pt-1 pb-0");
        let status = $(this).html();
        switch (status) {
            case "0":
                $(this).html("<i class='bi bi-bookmark-dash text-warning'></i>");
                break;
            case "1":
                $(this).html("<i class='bi bi-bookmark-check text-success'></i>");
                break;
            default:
                $(this).html("<i class='bi bi-bookmark-dash text-danger'></i>");
        }
    })

    // theme all the label for input
    $('label[for]').each(function() {
        $(this).addClass("text-light");
    })

    // theme all the H4 for title
    $('h4').each(function() {
        $(this).addClass("text-light");
    })

    // theme all the tables
    $('table').each(function() {
        $(this).addClass("table table-dark table-striped table-borderless");
    })
    $('thead').each(function() {
        $(this).addClass("table-primary");
    })
});
