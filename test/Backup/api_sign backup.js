$(document).ready(function() {

    let createSign = $(".create-sign");
    let signupFields = $(".signup-container");
    let verificationSection = $(".verification-section");
    let errorMsgContainer = $(".error-msg");
    let errorMsg = $(".error-list")
    let countdownInterval;

    // user email-password
    $('.submit-btn').on('click', function(e){
        e.preventDefault();

        let signForm = {
             email: $(".email input").val().trim(),
             password: $(".password input").val().trim(),
             confirm: $(".confirm_password.input").val().trim()

        };
        
        console.log("test", signForm.confirm)


        $.ajax({
            method: "POST",
            url: "/api/signup",
            contentType: "application/json",
            data: JSON.stringify(signForm),
            dataType: "json",
            success: function(response){
                if (response.success === true){
                    console.log("Response of the Server", response.success);
                    errorMsg.empty();
                    errorMsgContainer.removeClass("show");
                    

                    client_result(response);
                    startTimer(response.time);
    
                } else {
                    errorMsg.empty();
                    errorMsgContainer.removeClass("show");
                   

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

                alert(errorMessage);
            }
        });
    });


    function client_result(response){

       
        signupFields.addClass("hide-signup");
        $('.terms').addClass("hide-signup");
        $('.create-sign').addClass("hide-signup");
        

        setTimeout(() => {

            signupFields.hide();  
            createSign.attr("data-before", "Verification Code");
            $('.create-sign').addClass("show-verification");
            verificationSection.show().addClass("show-verification");
            }, 1000);
            
            let maskedEmail = response.username.replace(/^(.{2}).+(@.+)$/, "$1****$2");
            $(".otp-email").text(maskedEmail);
    }

    function startTimer(otp_time) {
        let timerSpan = $(".timer");
       
        clearInterval(countdownInterval);

        console.log("Timweeesa:" , otp_time)

        timerSpan.addClass("disabled").attr("data-content", otp_time + "s");
    
        let countdown = setInterval(() => {
            otp_time--;
            timerSpan.attr("data-content", otp_time + "s");
    
            if (otp_time <= 0) {
                clearInterval(countdown);
                timerSpan.removeClass("disabled").attr("data-content", "Resend");
            }
        }, 1000);
    }
    
    
});




$(document).ready(function () {
    let signupFields = $(".signup-container");
    let createSign = $(".create-sign");
    let verificationSection = $(".verification-section");
    let otpInputs = $(".otp-digit");
    let verifyBtn = $(".verify-btn");
    let backBtn = $(".back-btn");
    


   otpInputs.on("input", function () {
        let nextInput = $(this).next(".otp-digit");

        if (nextInput.length && $(this).val()) {
            nextInput.focus();
        }

        let otpCode = otpInputs.map((_, el) => $(el).val()).get().join("");

        if (otpCode.length === otpInputs.length) {
            verifyBtn.removeClass("disable-btn");
        } else {
            verifyBtn.addClass("disable-btn");
        }
    });

    otpInputs.on("keydown", function (e) {
        let currentInput = $(this);
        let prevInput = currentInput.prev(".otp-digit");

        
        if (e.key === "Backspace" && !currentInput.val() && prevInput.length) {
            prevInput.focus().val(""); 
        }
    
        if(e.which === 13){
            e.preventDefault();
            $('.verify-btn').click();
        }

    });


    backBtn.on('click', function(){
        verificationSection.removeClass("show-verification");

        setTimeout(() => {
            verificationSection.hide();
            signupFields.show().removeClass("hide-signup");
            createSign.attr("data-before", "Create Account");
        }, 500);
    });


    $(".password input").on("input", function () {
        let toggleIcon = $(this).siblings(".password-toggle");
        if ($(this).val().trim() !== "") {
            toggleIcon.removeClass("hidden"); 
        } else {
            toggleIcon.addClass("hidden");
        }
    });

    $(".password-toggle").on("click", function () {
        let passwordInput = $(this).siblings("input");
        let showIcon = $(this).find(".show-icon");
        let hideIcon = $(this).find(".hide-icon");

        if (passwordInput.attr("type") === "password") {
            passwordInput.attr("type", "text");
            showIcon.addClass("hidden");
            hideIcon.removeClass("hidden");
        } else {
            passwordInput.attr("type", "password");
            hideIcon.addClass("hidden");
            showIcon.removeClass("hidden");
        }
    });

});


$(document).ready(function () {
    let emailInput = $(".email input");
    let passwordInput = $(".password input");
    let confirmPasswordInput = $(".confirm_password");
    let submitBtn = $(".submit-btn");

    submitBtn.addClass("disable-btn");


    function checkFields() {
        let allFilled = emailInput.val().trim() !== "" &&
                        passwordInput.val().trim() !== "" &&
                        confirmPasswordInput.val().trim() !== "";

        submitBtn.toggleClass("disable-btn", !allFilled).prop("disabled", !allFilled);
    }

    emailInput.on("input", checkFields);
    passwordInput.on("input", checkFields);
    confirmPasswordInput.on("input", checkFields);
});






$(document).ready(function() {

    let createSign = $(".create-sign");
    let signupFields = $(".signup-container");
    let verificationSection = $(".verification-section");
    let errorMsgContainer = $(".error-msg");
    let errorMsg = $(".error-list")
    let countdownInterval;

    // user email-password
    $('.submit-btn').on('click', function(e){
        e.preventDefault();

        let signForm = {
             email: $(".email input").val().trim(),
             password: $(".password input").val().trim(),
             confirm: $(".confirm_password.input").val().trim()

        };
        
        console.log("test", signForm.confirm)


        $.ajax({
            method: "POST",
            url: "/api/signup",
            contentType: "application/json",
            data: JSON.stringify(signForm),
            dataType: "json",
            success: function(response){
                if (response.success === true){
                    console.log("Response of the Server", response.success);
                    errorMsg.empty();
                    errorMsgContainer.removeClass("show");
                    

                    client_result(response);
                    startTimer(response.time);
    
                } else {
                    errorMsg.empty();
                    errorMsgContainer.removeClass("show");
                   

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

                alert(errorMessage);
            }
        });
    });


    function client_result(response){

       
        signupFields.addClass("hide-signup");
        $('.terms').addClass("hide-signup");
        $('.create-sign').addClass("hide-signup");
        

        setTimeout(() => {

            signupFields.hide();  
            createSign.attr("data-before", "Verification Code");
            $('.create-sign').addClass("show-verification");
            verificationSection.show().addClass("show-verification");
            }, 1000);
            
            let maskedEmail = response.username.replace(/^(.{2}).+(@.+)$/, "$1****$2");
            $(".otp-email").text(maskedEmail);
    }

    function startTimer(otp_time) {
        let timerSpan = $(".timer");
       
        clearInterval(countdownInterval);

        console.log("Timweeesa:" , otp_time)

        timerSpan.addClass("disabled").attr("data-content", otp_time + "s");
    
        let countdown = setInterval(() => {
            otp_time--;
            timerSpan.attr("data-content", otp_time + "s");
    
            if (otp_time <= 0) {
                clearInterval(countdown);
                timerSpan.removeClass("disabled").attr("data-content", "Resend");
            }
        }, 1000);
    }
    
    
});


