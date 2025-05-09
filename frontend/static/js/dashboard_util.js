
$(document).ready(function(){
    

    let isHovering = false;
    let hideTimeout;
    

    $(window).on('scroll', function(){
        if($(this).scrollTop() > 160) {
            $('#header').removeClass('header-transparent')
            $('#header_wrp').removeClass('header_wrp-transparent')
            $('#top-bar-wrp').removeClass('top-bar-unfixed')
            $('#topbar').removeClass('topbar-unfixed')
            $('#topbar-avatar').removeClass('account-avatar')
            
            
            
            $('#top-bar-wrp').addClass('top-bar-fixed')
            $('#topbar').addClass('topbar-fixed')
            $('#topbar-avatar').addClass('top-avatar-fixed')

        }else {
            $('#header').addClass('header-transparent')
            $('#header_wrp').addClass('header_wrp-transparent')
            $('#top-bar-wrp').addClass('top-bar-unfixed')
            $('#topbar').addClass('topbar-unfixed')

            $('#topbar-avatar').addClass('account-avatar')
            $('#topbar-avatar').addClass('top-avatar-unfixed')
            $('#topbar-avatar').removeClass('top-avatar-fixed')
        }
    })


    $('.header-avatar, #my-float-dialog').hover(
        function () {
          
            clearTimeout(hideTimeout);
            isHovering = true;
            $('#my-float-dialog').removeClass('d-none');
        },
        function () {
     
            hideTimeout = setTimeout(function () {
                if (!isHovering) {
                    $('#my-float-dialog').addClass('d-none');
                }
            }, 200); // adjust delay if needed
            isHovering = false;
        }
    );
    
        $('#logout').on('click', function () {
                    $('#logout-confirmation').removeClass('d-none');
            
                    $('#logout-no').on('click', function () {
                        $('#logout-confirmation').addClass('d-none');
                    });

                    $('#logout-yes').on('click', function () {
                        sessionStorage.clear();
                        window.location.href = "http://127.0.0.1:5000";
                    });
        });




})


// DMI number

$('#transaction-number').on('input', function(){

    let input = $(this).val().replace(/\D/g, '');

    input = input.substring(0, 11);

    let formatted = input.replace(/(\d{4})(\d{3})(\d{0,4})/, function(_, a, b, c){
        return [a, b, c].filter(Boolean).join(' ');
    });

    $(this).val(formatted);

});






