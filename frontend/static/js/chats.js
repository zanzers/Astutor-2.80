$(document).on('click', '.chat_person', function () {

    
    var imgSrc = $(this).find('img').attr('src') || '/static/img/profile.jpg';
    var userName = $(this).find('.contact-name').data('info');
    var userId = $(this).find('.contact-name').data('id');
    var newMessage = $(this).find('.contact-message').data('newmsg');


    $('.chat_item').removeClass('active');

    var existingCard = $(`.chat_item[data-id="${userId}"]`);
    
    if (existingCard.length === 0) {
    
        var visibleChats = $('#chatContainer .chat_item');
        if (visibleChats.length >= 2) {
            visibleChats.first().addClass('d-none');
        }

        
        var chatItemHTML = `
            <div class="chat_item active" data-id="${userId}">
                <div class="chat-card-header">
                    <div class="chat-user">
                        <img src="${imgSrc}" alt="Profile" />
                        <span class="chat-name">${userName}</span>
                    </div>
                    <div class="chat-actions">

                        <i class="icon sent-dmi bx transaction-icon bx-shield-alt-2" title="Add Online Transaction"></i>

                
                    
                        <i class='icon bx bx-x close-icon' title="closed"></i>
                    </div>
                </div>
                <div class="chat-card-body">
                   
                </div>
                 <div class="chat-card-footer">
                    <input type="text" id="mgs-input" placeholder="Type a message..." />

                    <div role="button" class="sent-msg">
                     <i class=' icon bx bxs-send bx-rotate-360' style='color:#ffffff' ></i>
                    </div>
                    
                </div>
            </div>
        `;

        $('#chatContainer').append(chatItemHTML);

        let chatItem = $(`.chat_item[data-id="${userId}"]`);
        const myId = sessionStorage.getItem("userID");
        

        $.ajax({
            url: "/api/messages",
            type: "GET",
            data: {
                sender_id: myId,
                receiver_id: userId
            },
            success: function(response) {
                if (response.success && response.messages.length > 0) {
                    console.log("History msg", response)
                    response.messages.forEach(msg => {
                        const type = msg.sender_id == myId ? 'outgoing' : 'incoming';
                        let imagePath = msg.image_path;

                        if (imagePath) {
                           
                            const fileName = imagePath.split(/[/\\]/).pop(); 
                            imagePath = `api/message-images/${fileName}`;
                        }
                        
                        appendMessage(chatItem, msg.message, type, imagePath);
                    });
                }
            },
            error: function(err) {
                console.error("Failed to load messages", err);
            }
        });
    }
});


$(document).on('click', '.close-icon', function () {
    $(this).closest('.chat_item').remove();
    var hiddenCards = $('.chat_item').removeClass('d-none').first();
    if (hiddenCards.length) {
        hiddenCards.removeClass('hidden').appendTo('#chatContainer');
    }
});

$(document).on('click', '.chat_person', function () {
    $('#my-float-dialog-msg').addClass('d-none');
    $('.bxs-chat').removeClass('active-chat')
});


$('#header-message').on('click', function () {

    console.log("my-float-dialog-msg")
    $('.my-float-dialog-msg').toggleClass('d-none');
    $('.bxs-chat').toggleClass('active-chat')

});


