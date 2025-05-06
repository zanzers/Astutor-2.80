$(document).ready(function() {
    const id= sessionStorage.getItem("userID");
    const tutorID= sessionStorage.getItem("tutorID");
    let accountSetup = false;
    

    // OTP request 
    $('#togglePaymentDetails').on('click', function(){

        const otpData = {
            userId: id,
        };

        console.log("Request OTP: ", otpData)

        $.ajax({
          url: '/api/getting-started/setup',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(otpData),
          success: function (response) {

            $('.payment_email').text(response.email)

            console.log('Server response:', response);
            alert(`Email: ${response.email}, OTP: ${response.otp}`);
     
          },
          error: function (xhr, status, error) {
            alert('Failed to request OTP. Please try again by togglePaymentDetails.');
            console.error('Error:', error);
          }
        });
    });

    // Verified OTP
    $('#verifyOtpBtn').on('click', function(){

        let email = $('.payment_email').text()
        let otpCode = '';

        $('.otp-input').each(function(){
            otpCode += $(this).val()
        });
        
        
        const otpValidation = {
            email: email,
            otpInput: otpCode
        }
        
        console.log("Entered OTP:", otpValidation)

         $.ajax({
          url: '/api/getting-started/verify',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(otpValidation),
          success: function (response) {
        
            alert(`Email Verified`)
            console.log('Server response:', response);
            $('.otp_wrp').addClass('d-none');
             $('.pref_payment').removeClass('d-none');

          },
          error: function (xhr, status, error) {
            console.error('Error:', error);
          }
        });


    });

    // Method part
    $('#MethodBtn').on('click', function(){
        const methodSelected = $('#paymentMethod').val();
        const pricing  = $('#pricing').val();
        let number = $('#paymentNumber').val();
        const fullNumber = `+63${number}`;
        $('.error-payment').text('');
        $('#paymentMethod, #paymentNumber').removeClass('is-invalid');

        if(!methodSelected || number.length !== 10){
            $('.error-payment').text("Please select a payment method and enter a valid 9-digit number.");
        
            if (!methodSelected) $('#paymentMethod').addClass('is-invalid');
            if (number.length !== 10) $('#paymentNumber').addClass('is-invalid');
    
            return;
        }

        const accountData = {
            userId: id,
            tutorID: tutorID,
            pricing: pricing,
            paymentMethod: methodSelected,
            phoneNumber: fullNumber
        }

        console.log("Account:", accountData);
        
         $.ajax({
          url: '/api/getting-started/payment_method',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(accountData),
          success: function (response) {
        
            console.log('response:', response);
            $('.pref_payment').addClass('d-none');
            $('.confirmation').removeClass('d-none');
        
            $('#confirmedFirstname').text(response.firstname);
            $('#confirmedLastname').text(response.lastname);
            $('#confirmedEmail').text(response.email);
            $('#confirmedPhoneNumber').text(response.number);
            $('#confirmedRate').text(response.rate);
            $('.complete_registration').prop('disabled', false);
            $('.container').removeClass('d-none')
            accountSetup = true;
            alert(`Phone Number: ${response.number}, Name: ${response.firstname}`);
          },
          error: function (xhr, status, error) {
            console.error('Error:', error);
          }
        });

    })

    // Complete
    $('.complete_registration').on('click', function(){


        const pricing  = $('#pricing').val();

        const pricingData = {
            userId: id,
            pricing: pricing
        }

        if(!accountSetup){
           
            console.log("acount1")
            $.ajax({
                url: '/api/getting-started/without_the_account',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(pricingData),
                success: function (response) {
              
                  console.log('response:', response);
                  $('.reviewOverlay').removeClass('d-none');
              
                },
                error: function (xhr, status, error) {
                  console.error('Error:', error);
                }
              });

        } else {
            console.log("acount2")
            const con_fname = $('#confirmedFirstname').text()
            const con_lname = $('#confirmedLastname').text()
            const con_email = $('#confirmedEmail').text()
            const con_number = $('#confirmedPhoneNumber').text()

            const confirm_data = {
                tutorID: tutorID,
                fname: con_fname,
                lname: con_lname,
                email: con_email,
                number: con_number,
                userId: id,
            }

            $.ajax({
                url: '/api/getting-started/confirmation',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(confirm_data),
                success: function (response) {
              
                  console.log('response:', response);
                  $('.reviewOverlay').removeClass('d-none');
              
                },
                error: function (xhr, status, error) {
                  console.error('Error:', error);
                }
              });
            } 
    }) 


    
    // DONT TOUCH!
    $('.proceed_btn').on('click', function(){
        window.location.href = `/api/dashboard/Astutor-tutor`;
    })

}) 




