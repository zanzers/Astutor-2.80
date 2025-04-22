
  $(document).ready(function () {
    
    $('#pricing').on('input', function () {
      let value = $(this).val();
      if (value.length > 4) value = value.slice(0, 4);
      $(this).val(value);
  });
  

    $('#togglePaymentDetails').on('click', function () {
      const currentText = $(this).text().trim();
      $('#paymentDetailsForm').toggleClass('d-none');

      
      if(currentText === 'Add Online Payment'){
        $(this).text('Cancel Payment Setup');
        $('.complete_registration').prop('disabled', true);
      } else {
        $(this).text('Add Online Payment');
        $('.complete_registration').prop('disabled', false);
      }
    });


    $('.otp-input').on('input', function () {
      const input = $(this);
      const value = input.val();
      const digit = value.replace(/\D/g, ''); 
    
      switch (digit.length) {
        case 0:
          input.val('');
          break;
        case 1:
          input.val(digit);
          input.next('.otp-input').focus();
          break;
        default:
          input.val(digit.charAt(0));
          input.next('.otp-input').focus();
          break;
      }
    });

    $('.otp-input').on('keydown', function (e) {
      if (e.key === 'Backspace' && $(this).val() === '') {
        $(this).prev('.otp-input').focus();
      }
    });


    $('#qrCodeUpload').on('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          $('#qrPreview').attr('src', e.target.result).removeClass('d-none');
        };
        reader.readAsDataURL(file);
    }
    });

    $('#paymentNumber').on('input', function () {
      let value = $(this).val();

      value = value.replace(/\D/g, '');
      if (value.startsWith('0')) {
          value = value.slice(1);
      }
      value = value.slice(0, 9);
  
      $(this).val(value);
  });
  
    $('#goBackBtn').on('click', function () {
      $('.container').addClass('d-none');

    $('.pref_payment').removeClass('d-none');
  });
  




  });






