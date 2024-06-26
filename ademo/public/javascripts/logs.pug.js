$('#tblLogs').tablemanager({
    pagination: true,
    //numOfPages: "8",
    //disable: [1, 10, "last"]
});

$('#tblHitlogs').tablemanager1({
    pagination: true,
    //numOfPages: "8",
    disable: [6, "last"]
});

$('[name="uLinkin"]').each(function() {
    var linkin = window.location.href.replace("logs", "nav2?to=") + $(this).html();
    var html = '<a href="#" onclick="alert(\'' + linkin + '\');return false;">' 
        + '<i class="bi bi-link text-info"></i>' 
        + '</a>';
    $(this).html(html);
});
/*
$("#login-tab").click(function() {
    alert("login-tab");
})

$("#hit-tab").click(function() {
    alert("hit-tab");
})
*/