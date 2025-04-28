$(document).ready(function() {


    console.log("setup")
    const pricingInput = $('#pricing');
    const completeBtn = $('.complete_registration');
    

    function checkPricingInput() {
        const price = pricingInput.val().trim();

        if (price === '' || parseFloat(price) <= 0) {
        
            completeBtn.prop('disabled', true);
            $('.paymentLinkWrapper').addClass('d-none')
        } else {
         
            completeBtn.prop('disabled', false);
            $('.paymentLinkWrapper').removeClass('d-none')
        }
    }


    pricingInput.on('input', function() {
        checkPricingInput();
    });

  
    checkPricingInput();
});
