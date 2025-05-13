$(document).ready(function() {

    $(document).on('click', '.sent-msg', function() {
        const chatItem = $(this).closest('.chat_item');
        sendMessageHandler(chatItem);
    });

    $(document).on('keydown', '.chat-card-footer input[type="text"]', function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();  
            const chatItem = $(this).closest('.chat_item');
            sendMessageHandler(chatItem);
        }
    });

    function sendMessageHandler(chatItem) {
        const senderId = sessionStorage.getItem('userID');
        const receiverId = chatItem.data('id'); 
        const messageInput = chatItem.find('.chat-card-footer input[type="text"]');
        const newMessage = messageInput.val().trim();



        if (newMessage !== "") {
            $('.chat_item').removeClass('active');       
            chatItem.addClass('active');           

            appendMessage(chatItem, newMessage, "outgoing");
            console.log("SENT", )
            sendMessage(senderId, receiverId, newMessage);
            messageInput.val('');  
        }
    }

    window.appendMessage = function(chatItem, messageText, messageType, imagePath = null) {
        const chatBody = chatItem.find('.chat-card-body');

        let messageHTML = `<div class="chat-message ${messageType}">`;

        if (messageText) {
            messageHTML += `<p>${messageText}</p>`;
        }

        if (imagePath) {
            const fixedPath = imagePath.replace(/\\/g, '/');
            messageHTML += `<img src="/${fixedPath}" alt="Attachment" class="chat-image" />`;
        }

        messageHTML += `</div>`;

        chatBody.append(messageHTML);
        chatBody.scrollTop(chatBody[0].scrollHeight);
    };


});


function sendMessage(senderId,receiverId,newMessage, dmi_img = null ){
    console.log('senderId',senderId, 'receiverId', receiverId, "newMessage", newMessage)

    const sentMsg = {
        'senderId':senderId,
        'receiverId': receiverId,
        'newMessage': newMessage,
        'dmi_img': dmi_img
        
    }

    $.ajax({

        url: '/api/dashboard/sent',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(sentMsg),
        success: function (response) {
           
        },
        error: function (xhr, status, error) {
          alert('Failed to load load_content_tutor.');
          console.error('Error:', error);
        }

})


}






$(document).on('click', '.sent-dmi',function(e) {
    e.stopPropagation(); 


    let attemp = 3
    
    console.log("sent-dmisent-dmisent-dmisent-dmi")
    $('.transaction-modal').removeClass('d-none');


    $(document).click(function(e) {
        if (!$(e.target).closest('.chat-header-menu, .chat_menu-option').length) {
            $('.chat_menu-option').addClass('d-none'); 
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
            $('.sent-dmi').addClass('d-none');
            alert('Online Payment Disable. Please contact support.');
        }


    })


    });

    




    