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

$("#formAgentEdit").validate({
    errorClass: 'text-danger',
    rules: {
        ['ipt1stName']: "required",
        ['iptLstName']: "required",
        ['iptUsername']: {
            required: true,
            minlength: 3
        },
        ['iptPassword']: {
            required: true,
            minlength: 5
        },
        ['iptPassword2']: {
            required: true,
            minlength: 5,
            equalTo: "#iptPassword"
        }
    },
    message: {
        //
    },
    submitHandler:function(form){
        let id = $("#iptId").val();
        var officeid = $('#selOffi').val();
        var officename = $('#selOffi' + " option:selected").text();
        var fstName = $("#ipt1stName").val();
        var lstName = $("#iptLstName").val();
        var username = $("#iptUsername").val();
        var password = $("#iptPassword").val();
        var status = $("#chkStatus").prop("checked") ? 1 : 0;
        var note = $("#txtNote").val();
        var selsites = [];
        $("input[name='iptSite']:checked").each(function() {
            selsites.push(parseInt($(this).val()));
            //alert($(this).val());
        })
        console.log(`[debug from agent.pug (selsites)]${JSON.stringify(selsites)}`)
        $.ajax({
                url: "agents_dwit",
                type: "post",
                data: {
                submitType: "ajax_edit",
                iptId: id,
                selOffice: officeid,
                ipt1stName: fstName,
                iptLstName: lstName,
                iptUsername: username,
                iptPassword: password,
                chkStatus: status,
                txtNote: note,
                "selSites": selsites.join(",")
            },
            dataType: "json",
            success: function(data) {
                if (data.rst == 1) {
                    $('#iptId').val(id);
                    $('#selOffi').val(officeid);
                    $("#ipt1stName").val(fstName);
                    $("#iptLstName").val(lstName);
                    $("#iptUsername").val(username);
                    $("#iptPassword").val(password);
                    $("#iptPassword2").val(password);
                    $("#chkStatus").val(status);
                    $("#chkStatus").prop("checked", status == 1 ? true : false);
                    $("#txtNote").val(note);
                    $("#tdOffice" + id).html(officename);
                    $("#tdUsableSites_" + id).html(selsites.length);
                    $("#tdUsername_" + id).html(username);
                    $("#tdPassword_" + id).html(password);
                    $("#tdStatus_" + id).html(status);
                    setuStatusIcon("#tdStatus_" + id);
                    $("#btnEnd_"+id).click();
                } else {
                    console.log(`[debug from agent.pug:script:ajax:(2)]${JSON.stringify(data)}`);
                }
            }
        })
    }
})
$('#tblAgents').tablemanager({
    pagination: true,
    //numOfPages: 8,
    disable: [1, 10, "last"]
});