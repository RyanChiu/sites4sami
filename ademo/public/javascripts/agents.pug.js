//use pagination-sort-filter-manager/tableManager
/*
$('.tablemanager').each(function() {
    $(this).tablemanager({
        pagination: true,
        numPerPage: 10,
        disable: [1, 10, "last"]
    });
});
*/
$('#tblAgents').tablemanager({
    pagination: true,
    //numOfPages: 8,
    disable: [1, 10, "last"]
});