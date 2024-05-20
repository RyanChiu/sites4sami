function hideOffi(id, hidden) {
    $.ajax({
    url: "offices_dwit",
    type: "post",
    data: {submitType: "ajax_hide", officeid: id, hidden: hidden},
    dataType: "json",
    success: function(data) {
        // console.log(`[debug from offices.pug:(hidden)]${hidden}`);
        if (data.rst == 1) {
        $("#tdStatus_" + id).data("status", hidden ? -1 : 1);
        $("#tdStatus_" + id).html(hidden ? -1 : 1);
        $("#chkStatus_" + id).val(hidden ? -1 : 1);
        $("#chkStatus_" + id).prop("checked", !hidden);
        $("#lnkHide_" + id).html(hidden ? "<i class='bi bi-eye-slash fs-5 text-secondary'></i>" : "<i class='bi bi-eye fs-5 text-info'></i>");
        setuStatusIcon("#tdStatus_" + id);
        } else {
        }
    }
    })
}
$("form[name='formOfficeEdit'").each(function() {
    let id = $(this).data("id");
    //alert(id);
    //validate every form
    $(this).validate({
    errorClass: 'text-danger',
    rules: {
        ['ipt1stName_'+id]: "required",
        ['iptLstName_'+id]: "required",
        ['iptUsername_'+id]: {
            required: true,
            minlength: 3
        },
        ['iptPassword_'+id]: {
            required: true,
            minlength: 5
        },
        ['iptPassword2_'+id]: {
            required: true,
            minlength: 5,
            equalTo: "#iptPassword_"+id
        }
    },
    message: {
        //
    },
    submitHandler:function(form){
        var fstName = $("#ipt1stName_" + id).val();
        var lstName = $("#iptLstName_" + id).val();
        var username = $("#iptUsername_" + id).val();
        var password = $("#iptPassword_" + id).val();
        var status = $("#chkStatus_" + id).val();
        var note = $("#txtNote_" + id).val();
        $.ajax({
        url: "offices_dwit",
        type: "post",
        data: {
            submitType: "ajax_edit",
            iptId: id,
            ipt1stName: fstName,
            iptLstName: lstName,
            iptUsername: username,
            iptPassword: password,
            chkStatus: status,
            txtNote: note
        },
        dataType: "json",
        success: function(data) {
            if (data.rst == 1) {
            $("#ipt1stName_" + id).val(fstName);
            $("#iptLstName_" + id).val(lstName);
            $("#iptUsername_" + id).val(username);
            $("#iptPassword_" + id).val(password);
            $("#chkStatus_" + id).val(status);
            $("#txtNote_" + id).val(note);
            //$("#td1stName_" + id).html(fstName);
            //$("#tdLstName_" + id).html(lstName);
            $("#tdUsername_" + id).html(username);
            $("#tdPassword_" + id).html(password);
            $("#tdStatus_" + id).html(status);
            $("#lnkHide_" + id).html(status == 1 ? "<i class='bi bi-eye fs-5 text-info'></i>" : "<i class='bi bi-eye-slash fs-5 text-secondary'></i>");
            setuStatusIcon("#tdStatus_" + id);
            //console.log(`[debug from office.pug:script:ajax:(1)]${JSON.stringify(data)}`);
            $("#btnEnd_"+id).click();
            } else {
            //console.log(`[debug from office.pug:script:ajax:(2)]${JSON.stringify(data)}`);
            }
        }
        })
    }
    });
})