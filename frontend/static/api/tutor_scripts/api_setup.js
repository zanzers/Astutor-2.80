$(document).ready(function() {
    const id= sessionStorage.getItem("userID");
    const tutorID= sessionStorage.getItem("tutorID");
    let accountSetup = false;
    

    // OTP request 
    $('#togglePaymentDetails').on('click', function(){

        const otpData = {
            userId: id,
            tutorID: tutorID
        };

        console.log("Request OTP: ", otpData)


        // check the request userId and generate the OTP 
        // along side of  the email then return the value.
        // Note in the backend save the email and OTP and compare them
        // if the user request the verification see at line 40;

        // $.ajax({
        //   url: '',
        //   type: 'POST',
        //   contentType: 'application/json',
        //   data: JSON.stringify(otpData),
        //   success: function (response) {

        //     console.log('Server response:', response);
        //     alert(`Email: ${response.email}, OTP: ${response.otp}`);
     
        //   },
        //   error: function (xhr, status, error) {
        //     alert('Failed to request OTP. Please try again.');
        //     console.error('Error:', error);
        //   }
        // });
    });

    // Verified OTP
    $('#verifyOtpBtn').on('click', function(){

        let otpCode = '';

        $('.otp-input').each(function(){
            otpCode += $(this).val()
        });
        
        
        const otpValidation = {
            userId: id,
            tutorID: tutorID,
            otpInput: otpCode
        }
        
        console.log("Entered OTP:", otpValidation)

        // check the input otp and email validation if they match 
        // return success: true


         // $.ajax({
        //   url: '',
        //   type: 'POST',
        //   contentType: 'application/json',
        //   data: JSON.stringify(otpValidation),
        //   success: function (response) {
        // 
        //     alert(`Email Verifired`)
        //     console.log('Server response:', response);
        //     $('.otp_wrp').addClass('d-none');
        //      $('.pref_payment').removeClass('d-none');

        //   },
        //   error: function (xhr, status, error) {
        //     console.error('Error:', error);
        //   }
        // });


    });

    // Method part
    $('#MethodBtn').on('click', function(){

        const methodSelected = $('#paymentMethod').val();
        const pricing  = $('#pricing').val();
        let number = $('#paymentNumber').val();
        const fullNumber = `+64${number}`;
        $('.error-payment').text('');
        $('#paymentMethod, #paymentNumber').removeClass('is-invalid');

        if(!methodSelected || number.length !== 9){
            $('.error-payment').text("Please select a payment method and enter a valid 9-digit number.");
        
            if (!methodSelected) $('#paymentMethod').addClass('is-invalid');
            if (number.length !== 9) $('#paymentNumber').addClass('is-invalid');
    
            return;
        }

        const accountData = {
            tutorID: tutorID,
            pricing: pricing,
            paymentMethod: methodSelected,
            phoneNumber: fullNumber
        }

        console.log("Account:", accountData);
        
        // option are base if user dint provide the Online payment 
        // so just save the Pricing, tutorId check line 145. 
        // Save tutorId , Pricing, paymentMethod, phoneNumber in the db return will be
        // success: true | name, lastname(if tutor), email, Gcash number and pricing;
        

         // $.ajax({
        //   url: '',
        //   type: 'POST',
        //   contentType: 'application/json',
        //   data: JSON.stringify(accountData),
        //   success: function (response) {
        // 
        //     console.log('response:', response);
        //     alert(`Phone Number: ${response.number}, Name: ${response.name}`);
        //     $('.pref_payment').addClass('d-none');
        //     $('.confirmation').removeClass('d-none');
        
        //     $('#confirmedName').text(response.name);
        //     $('#confirmedLastname').text(response.lastname);
        //     $('#confirmedEmail').text(response.email);
        //     $('#confirmedPhoneNumber').text(response.number);
        //     $('#confirmedPricing').text(response.pricing);
        //     $('.complete_registration').prop('disabled', false);
         //    accountSetup = true;
        //   },
        //   error: function (xhr, status, error) {
        //     console.error('Error:', error);
        //   }
        // });

    })

    // Complete
    $('#complete_registration').on('click', function(){
        const pricing  = $('#pricing').val();

        const pricingData = {
            tutorID: id,
            pricing: pricing
        }

        if(!accountSetup){
            // only save the pricing and show reviewOverlay if success it show the confirmation

        // $.ajax({
        //   url: '',
        //   type: 'POST',
        //   contentType: 'application/json',
        //   data: JSON.stringify(pricingData),
        //   success: function (response) {
        // 
        //     console.log('response:', response);
        //     $('.reviewOverlay').removeClass('d-none');
        
        //   },
        //   error: function (xhr, status, error) {
        //     console.error('Error:', error);
        //   }
        // });
        } else {
            // show reviewOverlay()
            // $('.reviewOverlay').removeClass('d-none');
        }
    })


    
    // DONT TOUCH!
    $('.proceed_btn').on('click', function(){
        window.location.href = `/api/dashboard/Astutor-tutor`;
    })

})




