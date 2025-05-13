$(document).ready(function(){  
        console.log("initSignup")
        let errorMsgContainer = $(".error-msg");
        let errorMsg = $(".error-list")
    

        $('.login-submit').on('click', function(e){
        e.preventDefault();
        email = $(".email input").val().trim(),
        password =  $(".password input").val().trim()

        
                let loginForm = {
                    email: email,
                    password: password
                };
        
        console.log("loginForm", loginForm)

        

        $.ajax({
            method: "POST",
            url: "/api/login-Astutor_user",
            contentType: "application/json",
            data: JSON.stringify(loginForm),
            dataType: "json",
            success: function(response){
                
                    if (response.success === true){
                        
                        errorMsg.empty();
                        errorMsgContainer.removeClass("show");
                        
                      
                        console.log("message", response.redirect_url, response.userId)
                        sessionStorage.setItem("userID", response.userId); 


                        
 
                        barba.go(response.redirect_url);

                        

                    } else {
                      
                        errorMsg.empty();
                        errorMsgContainer.removeClass("show");
                        console.log(response.error)
                        
                        if(response.errors && response.errors.length > 0){
                            errorMsgContainer.addClass("show");
                            let errorList = $("<ul></ul>");
                            response.errors.forEach(error => {
                                errorList.append(`<li>${error}</li>`)
                            });
                            errorMsg.append(errorList)
                        }
                    }
                },
                error: function(xhr, status, error){
                    console.error("AJAX Error: " , error);
                    let errorMessage = "Something went wrong. Please try again.";
    
                    if (xhr.responseJSON && xhr.responseJSON.errors) {
                        errorMessage = xhr.responseJSON.errors.join("\n");
                    }
    

                    errorMsg.empty();
                        errorMsgContainer.removeClass("show");


                        console.log(xhr.responseJSON);

                        if (xhr.responseJSON && xhr.responseJSON.errors && xhr.responseJSON.errors.length > 0) {
                            errorMsgContainer.addClass("show");
                            let errorList = $("<ul></ul>");
                            xhr.responseJSON.errors.forEach(error => {
                                errorList.append(`<li>${error}</li>`);
                            });
                            errorMsg.append(errorList);
                        } else {
                            errorMsg.append(`<p>${errorMessage}</p>`);
                        }
                }
            });




    })


    $(".email input, .password input").on("input", function() {
    let email = $(".email input").val().trim();
    let password = $(".password input").val().trim();

    if (email !== "" && password !== "") {
        $(".login-submit").removeClass("disable-btn").prop("disabled", false);
    } else {
        $(".login-submit").addClass("disable-btn").prop("disabled", true);
    }
});

})