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
                    $('#divLinks').html(
                        $('#divLinks').html() 
                            + link.name + "(" + link.abbr + "): " 
                            + window.location.href.replace("links", "nav2?to=") + link.param + "<br/>"
                    );
                    /*
                    $('#divLinks').html(
                        $('#divLinks').html() + link.url + "<a href='" + window.location.href + "/nav2?to=" + link.params + "'>" + index + "</a><br/>"
                    )
                    */
                    //console.log("[debug from links page of submit ajax (links):]"); console.log(link); //debug
                })
                console.log("[debug from links page of submit ajax (rst):]"); console.log(rst); //debug
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
                    + "<option value='" + agent.username + "'>" + agent.username + "</option>");
            }
            //console.log("[debug from links page of ajax:]"); console.log(rst); console.log(agents);// debug;
        }
    })
})