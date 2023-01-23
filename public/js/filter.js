$("#category").change(function () {
        filter(false);
})

// $("#sort").change(function () {
//         filter(true);
// })

// handle more than one?

// once we get one, check the other?

function filter(sort) {
        option = $("#category").val();
        filter_option = {filter: option, sort: sort}
        $.ajax({
                url: '/filter',
                type: 'post',
                dataType: 'json',
                data: filter_option,
                success: function(serverResponse) {
                        console.log(serverResponse);
                }
        });
}