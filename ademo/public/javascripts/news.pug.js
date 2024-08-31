const editor = Jodit.make('#joditNews');
//editor.value = '<p>start</p>';

function switchTabContents(tab) {
    if (tab == "news") {
        sessionStorage.setItem("alert", editor.value);
        $("#iptData1").val(editor.value);
        editor.value = sessionStorage.getItem("news");
        $("#iptCurTab").val(0);
        $("#btnPreview").toggleClass("d-none");
    } else if (tab == "alert") {
        sessionStorage.setItem("news", editor.value);
        $("#iptData1").val(editor.value);
        editor.value = sessionStorage.getItem("alert");
        $("#iptCurTab").val(1);
        $("#btnPreview").toggleClass("d-none");
    }
}

$(document).ready(function() {
    $("#iptUpload").change(function(e) {
        var files = $("#iptUpload")[0].files;
        var value = $("#iptUpload").val();
        var formData = new FormData();
        //formData.append('file', files);
        formData.append('files', files);
        formData.append('image', files.item(0));
        //console.log(`[debug from news.pug.js(formData):]${JSON.stringify(formData.get('file'))},${value}`);
        //console.log(`[debug from news.pug.js:]${JSON.stringify(files)}`);
        $.ajax({
            url: "upload_nov",
            type: "post",
            data: formData,
            contentType: false,
            processData: false,
            success: function(rst) {
                if (rst.ok) {
                    let img = "<img style='width:300px;' src='media/" + rst.fn + "'>";
                    $("#divShowIt").html(img);
                    $("#btnShowIt").click();
                    editor.value += img;
                    //$("#joditNews").text($("#joditNews").text() + img);
                } else {
                    $("#divShowIt").html("not ok!"/* + rst.msg*/);
                    $("#btnShowIt").click();
                }
            }
        })
    });

    $("#btnPreview").click(function(e) {
        $("#btnPopup").click();
    })

    sessionStorage.setItem("news", $("#joditNews").val());
    sessionStorage.setItem("alert", $("#iptData1").val());
    $("#news-tab").click(function(e) {
        switchTabContents("news");
    })
    
    $("#alert-tab").click(function(e) {
        switchTabContents("alert");
    })
});