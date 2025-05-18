$(document).ready(function(){

    const id= sessionStorage.getItem("userID");

    const user_data = {
        userID: id
    }

          $.ajax({
            url: "/api/load_student-content",
            type: "GET",
             data: JSON.stringify(user_data),
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








})