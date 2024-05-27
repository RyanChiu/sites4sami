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
        // console.log(`[debug from agents.pug.js (selsites)]${JSON.stringify(selsites)}`)
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
                    $("#tdOffice_" + id).html(officename);
                    $("#tdUsableSites_" + id).html(selsites.length);
                    $("#tdUsername_" + id).html(username);
                    $("#tdPassword_" + id).html(password);
                    $("#tdStatus_" + id).html(status);
                    setuStatusIcon("#tdStatus_" + id);
                    $("#btnEnd_"+id).click();
                } else {
                    // console.log(`[debug from agents.pug.js:script:ajax:(2)]${JSON.stringify(data)}`);
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

function getAgent(id) {
    $.ajax({
        url: "agents_dwit",
        type: "post",
        data: {
            submitType: "ajax_edit_",
            iptId: id,
        },
        dataType: "json",
        success: function(data) {
            if (data.rst == 1) {
                //console.log(`[debug from agents.pug.js:script:ajax:(1)]${JSON.stringify(data)}`);
                $('#iptId').val(data.ags.id);
                $('#selOffi').val(data.ags.officeid);
                $("#ipt1stName").val(data.ags["1stname"]);
                $("#iptLstName").val(data.ags.lstname);
                $("#iptUsername").val(data.ags.username);
                $("#iptPassword").val(data.ags.password);
                $("#iptPassword2").val(data.ags.password);
                $("#chkStatus").val(data.ags.status);
                $("#chkStatus").prop("checked", data.ags.status == 1 ? true : false);
                $("#txtNote").val(data.ags.note);
                $('input[name="iptSite"]').each(function() {
                  if (data.ags.sites.indexOf(parseInt($(this).val())) !== -1) {
                    //$("#divSite_" + $(this).val()).removeClass("d-none");
                    //$(this).attr("disabled", false);
                    $(this).prop("checked", $(this).is(':disabled') ? false : true);
                  } else {
                    //$(this).attr("disabled", true);
                    $(this).prop("checked", false);
                    //$("#divSite_" + $(this).val()).addClass("d-none");
                  }
                })
                /*
                $('#selOffi_' + id).val(officeid);
                $("#ipt1stName_"+id).val(fstName);
                $("#iptLstName_"+id).val(lstName);
                $("#iptUsername_" + id).val(username);
                $("#iptPassword_" + id).val(password);
                $("#chkStatus_" + id).val(status);
                $("#chkStatus_" + id).prop("checked", status == 1 ? true : false);
                $("#txtNote_" + id).val(note);
                $("#tdOffice_"+id).html(officename);
                $("#tdUsableSites_"+id).html(selsites.length);
                $("#tdUsername_" + id).html(username);
                $("#tdPassword_" + id).html(password);
                $("#tdStatus_" + id).html(status);
                setuStatusIcon("#tdStatus_" + id);
                $("#btnEnd_"+id).click();*/
            } else {
                // console.log(`[debug from agents.pug.js:script:ajax:(0)]${JSON.stringify(data)}`);
            }
        }
    })
}
function hideAgent(id, hidden) {
  $.ajax({
    url: "agents_dwit",
    type: "post",
    data: {submitType: "ajax_hide", agentid: id, hidden: hidden},
    dataType: "json",
    success: function(data) {
      // console.log(`[debug from agents.pug:(hidden)]${hidden}`);
      if (data.rst == 1) {
        $("#tdStatus_" + id).data("status", hidden ? -1 : 1);
        $("#tdStatus_" + id).html(hidden ? -1 : 1);
        //$("#chkStatus_" + id).val(hidden ? -1 : 1);
        //$("#chkStatus_" + id).prop("checked", !hidden);
        $("#lnkHide_" + id).html(hidden ? "<i class='bi bi-eye-slash fs-6 text-secondary'></i>" : "<i class='bi bi-eye fs-6 text-info'></i>");
        setuStatusIcon("#tdStatus_" + id);
      } else {
      }
    }
  })
}