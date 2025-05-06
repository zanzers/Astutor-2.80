function initLogin(){

    if (window.location.pathname !== '/api/login-Astutor') {
        $('.login-btn').removeClass('d-none');
    }else{
        $('.login-btn').addClass('d-none');
    }

    $('.login-btn').on('click', function(){

        window.location.href = '/api/login-Astutor'; 
        console.log("Login")
    })
    

}