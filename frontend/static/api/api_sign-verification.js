$(document).ready(function(){
        
        $('.verify-btn').on('click', function(e){
            e.preventDefault();
    
            let otpCode = $('.otp-digit').map((_, el) => $(el).val()).get().join("");
            let verifide_form = {
                email: $(".email input").val().trim(),
                password: $(".password input").val().trim(),
                otp: otpCode 
            };

            console.log("Sending OTP Verification Request:", verifide_form);
            
            $.ajax({
                method: "POST",
                url: "/api/verify-otp",
                contentType: "application/json",
                data: JSON.stringify(verifide_form),
                dataType: "json",
                success: function(response) {
                    if (response.success) {
                        $(".otp-digit").val(""); 
                        $(".otp-digit").removeClass("focused"); 
                        
                        localStorage.setItem("auth_token", response.token)
                        alert("OTP Verified! Redirecting...");
                        window.location.href = "/api/userinfo";
                    } else {
                        alert("Invalid OTP. Please try again.");
                    }
                },
                error: function(xhr, status, error) {
                    console.error("OTP Verification Error:", error);
                    alert("Something went wrong. Please try again.");
                }
            });
        });
})