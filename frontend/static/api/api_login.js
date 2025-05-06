$(document).ready(function(){  
    
    $('#login-user').on('click', function(e){
        e.preventDefault();
        
        let loginForm = {
            email: $(".email input").val().trim(),
            password: $(".password input").val().trim(),
       };
       

       $.ajax({
        method: "POST",
        url: "/api/login-Astutor",
        contentType: "application/json",
        data: JSON.stringify(loginForm),
        dataType: "json",
        success: function(response){
            
                console.log("Response of the Login", response.success);
                errorMsg.empty();
                errorMsgContainer.removeClass("show");
                              
                const { result_Message, url, } = message(response);
           
                alert(result_Message)
                console.log(result_Message)

                barba.go(url);
                

            
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
})