$(document).ready(function(){


    const id= sessionStorage.getItem("userID");
    console.log("first", id)

    const profile_path = $('.atr-avatar_img')
    const fullname = $('.userFullname')

    const user_data = {
        userId: id
    }

    $.ajax({

            url: '/api/dashboard/load_profile',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user_data),
            success: function (response) {
                

                console.log("load",response.img_url, response.name )
                profile_path.attr('src', response.img_url)
                fullname.text(response.name)

            
            },
            error: function (xhr, status, error) {
              alert('Failed to load load_profile.');
              console.error('Error:', error);
            }

    })



})