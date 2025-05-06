function initSignupApi(){
    console.log("initSignup")
        let errorMsgContainer = $(".error-msg");
        let errorMsg = $(".error-list")
    
    
    
        $('.submit-btn').on('click', function(e){
            e.preventDefault();
    
            let signForm = {
                 name: $(".name input").val().trim(),
                 email: $(".email input").val().trim(),
                 password: $(".password input").val().trim(),
                 confirm: $(".confirm_password.input").val().trim()
    
            };
            
            console.log("test", signForm.confirm)
    
    
            $.ajax({
                method: "POST",
                url: "/api/account",
                contentType: "application/json",
                data: JSON.stringify(signForm),
                dataType: "json",
                success: function(response){
                    if (response.success === true){
                        console.log("Response of the Server", response.success);
                        errorMsg.empty();
                        errorMsgContainer.removeClass("show");
                        
                      
                        const { result_Message, url, } = message(response);

                   
                        alert(result_Message)
                        console.log(result_Message)
    
                        barba.go(url);
                        

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
        });
    
    
  

    function message(response){
        const redirectUrl = response.redirect_url;
        const username = response.name;
        const userId = response.id;
        const email = response.email;

        sessionStorage.setItem("tempName", username)
        sessionStorage.setItem("tempEmail", email)
        sessionStorage.setItem("userID", userId)
        const messageText = `Welcome ${username}! Email: ${email}`;

        return { result_Message: messageText, url: redirectUrl };

    }
}