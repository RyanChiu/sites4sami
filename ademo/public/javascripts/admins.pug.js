function hideMoney4Admin(id, hidden) {
    $.ajax({
      url: "admins_dwit",
      type: "post",
      data: {submitType: "ajax_hide", adminid: id, hidden: hidden},
      dataType: "json",
      success: function(data) {
        // console.log(`[debug from admins.pug:(hidden)]${hidden}`);
        if (data.rst == 1) {
          $("#tdStatus_" + id).data("status", hidden ? 2 : 1);
          $("#lnkHide_" + id).html(hidden ? "<i class='bi bi-eye-slash fs-6 text-secondary'></i>" : "<i class='bi bi-eye fs-6 text-info'></i>");
        } else {
        }
      }
    })
  }