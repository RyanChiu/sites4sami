function saveLinks(siteid) {
    var names = [], abbrs = [], urls = [], payouts = [], earnings = [], statuses = [];
    $("input[name='iptLinkname_" + siteid + "']").each(function() {
      names.push($(this).val());
    })
    $("input[name='iptLinkabbr_" + siteid + "']").each(function() {
      abbrs.push($(this).val());
    })
    $("input[name='iptLinkurl_" + siteid + "']").each(function() {
      urls.push($(this).val());
    })
    $("input[name='iptLinkpayout_" + siteid + "']").each(function() {
      payouts.push($(this).val());
    })
    $("input[name='iptLinkearning_" + siteid + "']").each(function() {
      earnings.push($(this).val());
    })
    $("input[name='iptLinkstatus_" + siteid + "']").each(function() {
      statuses.push($(this).val());
    })
    //console.log(`[debug from ajax_edit (urls, statuses):]${JSON.stringify(urls)}, ${JSON.stringify(statuses)}`)
    $.ajax({
      url: "sites_dwit",
      type: "post",
      data: {
        submitType: "ajax_edit",
        siteId: siteid,
        linkNames: names.join(","),
        linkAbbrs: abbrs.join(","),
        linkUrls: urls.join(","),
        linkPayouts: payouts.join(","),
        linkEarnings: earnings.join(","),
        linkStatuses: statuses.join(",")
      },
      dataType: "json",
      success: function(data) {
        //console.log(`at least it's in!`);
        if (data.suc == 1) {
          //console.log(`[debug from ajax_edit (success):]${JSON.stringify(data.rst)}`)
          for (var i = 0; i < names.length; i++) {
            $("#lblTitle_" + siteid + "_" + abbrs[i]).html(
              "[" + names[i] + "] Abbr:" + abbrs[i] + ", Payout:" + payouts[i] + ", Earning:" + earnings[i]
            );
            var iStatus = $("#iStatus_" + siteid + "_" + abbrs[i]);
            if (statuses[i] == 1) {
              iStatus.removeClass();
              iStatus.addClass("me-2 bi bi-check-circle text-success");
            } else {
              iStatus.removeClass();
              iStatus.addClass("me-2 bi bi-slash-circle text-danger");
            }
          }
        } else {
          //console.log(`[debug from ajax_edit (failed)]`)
        }
      }
    })
  }