$(document).ready(function() {

    $('#edit-lesson').click(function(e) {
        e.stopPropagation(); 

        $('.lesson-option_dropdown').removeClass('d-none')

        
    });
    
 
});


$(document).click(function(e) {

    if (!$(e.target).closest('.option_container').length) {

        $('.lesson-option_dropdown').addClass('d-none');
    }
});




$(document).ready(function() {
    $('.chat-send-btn').click(function() {
        const messageText = $('.chat-input').val().trim();

        if (messageText !== "") {
            const myMessage = `
                <div class="chat-message chat-message-sent">
                    <div class="chat-msg-content">
                        <p>${messageText}</p>
                    </div>
                </div>
            `;

            $('.chats-wrp').append(myMessage);
            $('.chat-input').val('');
            $('.chats-container').scrollTop($('.chats-container')[0].scrollHeight);

            
        }
    });

    $('.chat-input').keypress(function(e) {
        if (e.which == 13) {
            $('.chat-send-btn').click();
        }
    });
});



$(document).ready(function() {
    $('.contact-item').click(function() {
        const contactName = $(this).find('.contact-name').text();
        const contactPic = $(this).find('.contact-pic').attr('src');


        $('.chat-header-pic').attr('src', contactPic);
        $('.chat-header-name').text(contactName);

        $('.chats-wrp').empty();


        const sampleMessages = `
            <div class="chat-message">
                <img src="${contactPic}" class="chat-msg-pic">
                <div class="chat-msg-content">
                    <span class="chat-msg-name">${contactName}</span>
                    <p>Hi there! 👋</p>
                </div>
            </div>
        `;

        $('.chats-wrp').append(sampleMessages);
    });
});






$(document).ready(function() {

    let attemp = 3

    $('.chat-header-menu').click(function(e) {
        e.stopPropagation(); 
        $('.chat_menu-option').toggleClass('d-none');


        $('.chat-menu-item').click(function() {

            
            $('.chat_menu-option').addClass('d-none');
            $('.transaction-modal').removeClass('d-none');
        });
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.chat-header-menu, .chat_menu-option').length) {
            $('.chat_menu-option').addClass('d-none'); // Close the menu if clicked outside
        }
    });


    $('.closed-btn').on('click', function(){
        console.log("closed")
        $('.transaction-modal').addClass('d-none');
    })





    $('#cancelBtn').on('click', function(){

        $('.transaction-modal').addClass('d-none');
        $('.transaction-modal-content').removeClass('d-none');
        $('#transactionFailed').addClass('d-none');

    })
    $('#Dmi-confirm').on('click', function(){

        $('.transaction-modal').addClass('d-none');
        $('.transaction-modal-content').removeClass('d-none');
        $('#transactionSuccess').addClass('d-none');

    })



    $('#retryBtn').on('click', function(){

        $('#transactionFailed').addClass('d-none');
        $('.transaction-modal-content').removeClass('d-none');


        if (attemp > 0){
            attemp--;

            $('#attempt').text(`(${attemp})`)
            $('#transaction-fname').val('');
            $('#transaction-lname').val('');
            $('#transaction-email').val('');
            $('#transaction-number').val('');
        }
        else{

            $('.transaction-modal').addClass('d-none');
            $('#transactionFailed').addClass('d-none');
            $('.transaction-modal-content').removeClass('d-none');
            $('.transaction-modal-content').addClass('d-none');
    

            $('#attempt').text('(0)');
            $('#retryBtn').prop('disabled', true); 
            $('.chat-menu-item').addClass('disabled');
            alert('Online Payment Disable. Please contact support.');
        }


    })

});