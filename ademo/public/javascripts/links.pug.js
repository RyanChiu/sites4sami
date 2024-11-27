$("#formLinks").validate({
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

$("#formLinks").on("submit", function() {
    if ($('#selAgent').val() !== '' && $('#selSite').val() !== '')
        $.ajax({
            url: "links",
            type: "post",
            data: {
                siteid: $('#selSite').val(),
                agent: $('#selAgent').val()
            },
            dataType: "json",
            success: function(rst) {
                $('#divLinks').html("");
                $.each(rst.rst, function(index, lnk) {
                    let link = $.parseJSON(lnk);
                    // console.log(`plaint text of lnk: ${lnk}`);
                    if (parseInt(link.status) == 1) {
                        var lnkCopyLinkId = 'lnkCopyLink_' + link.abbr;
                        var iptShowLinkId = 'iptShowLink_' + link.abbr;
                        var showTitle = "<div class='col-3 p-2'>" 
                            + "<a class='icon-link icon-link-hover link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' href='#' id='" + lnkCopyLinkId + "' onclick='copy2Clipboard(\"" + lnkCopyLinkId + "\", \"" + iptShowLinkId + "\")' data-bs-link-toggle='tooltip' title='" + link.alias + "'>"
                            // + link.name + "(" + link.alias + ")"
                            + link.name 
                            + "<i class='bi bi-clipboard fs-6 pb-4'></i>"
                            // + "<svg class='bi' aria-hidden='true'><use xlink:href='#clipboard'></use></svg>"
                            + "</a>"
                            + "</div>";
                        var showLink = "<div class='col-9 p-2'>"
                            + "<input id='" + iptShowLinkId + "' value='"
                            + window.location.href.replace("links", "nav2?to=") 
                            + link.param + "' class='w-100 form-input rounded-2 border-success' readonly></div>";
                        $('#divLinks').html(
                            $('#divLinks').html() 
                                + "<div class='row w-100'>"
                                + showTitle 
                                + showLink
                                + "</div>"
                        );
                    }
                })
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-link-toggle="tooltip"]'));
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }
        })
})

$('#selOffice').on("change", function() {
    //alert($('#selOffice').val());
    $.ajax({
        url: "ags_nov",
        type: "post",
        data: {officeid: $('#selOffice').val()},
        dataType: "json",
        success: function(rst) {
            $('#selAgent').html("<option value=''>-Pick an agent-</option>");
            let agents = $.parseJSON(rst.rst);
            for (let agent of agents) {
                $('#selAgent').html($('#selAgent').html() 
                    + "<option value='" + agent.username + "' data-sites='" + agent.sites + "'>" + agent.username + "</option>");
            }
            //console.log("[debug from links page of ajax:]"); console.log(rst); console.log(agents);// debug;
        }
    })
})

$("#selAgent").on("change", function() {
    let opt = $("#selAgent option:selected");
    let siteids = (opt.data("sites")+ "").split(",");
    let sites = $.parseJSON($("#iptSites").val());
    let selSite = $("#selSite");
    /*
    if (siteids.length > 1)
        selSite.html("<option value=''>-Pick a site-</option>");
    else selSite.html("");
    */
    selSite.html("<option value=''>-Pick a site-</option>");
    //console.log(`[debug from link.pug.js(sties):]${JSON.stringify(sites)}`);
    //console.log(`[debug from link.pug.js(siteids):]${JSON.stringify(siteids)} from ***${opt.data("sites")}***`);
    for (let site of sites) {
        //console.log(`[debug from link.pug.js(site.name):]${site.name}`);
        if (siteids.indexOf(site.id + "") !== -1) {
            selSite.html(selSite.html()
                + "<option value='" + site.id + "'>" + site.name + "</option>");
        }
    }
    //console.log(`[debug from link.pug.js(options):]${selSite.html()}`);
})
