$(document).ready(function(){
    const tutorID= sessionStorage.getItem("tutorID");

    $('.verify-button').on('click', function(){

        const chatItem = $('.chat_item.active');

        const t_fname = capitalizeFirts($('#transaction-fname').val());
        const t_lname =capitalizeFirts( $('#transaction-lname').val());
        const t_email = $('#transaction-email').val()
        const t_number = $('#transaction-number').val()
        const receiverId = chatItem.data('id');
        const senderId = sessionStorage.getItem('userID');


        console.log("receiverId", receiverId)
        const verify_data = {
            ttutorID: tutorID,
            tfname: t_fname,
            tlname: t_lname,
            temail: t_email,
            tnumber: t_number
        }


        console.log("verify_data", verify_data)


        
        $.ajax({
            url: "/api/dashboard/transactions",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(verify_data),
            success: function (response) {
                const message = "Your identity has been verified by DMI ✔";
                const dmi_img = response.dmi_img;
        
                if (response.success){
                    const dmiImageMessage = `
                    <div class="chat-message outgoing dmi-verification-msg">
                        <div class="chat-msg-content">
                            <p>Your identity has been verified by DMI ✔</p>
                            <img src="data:image/png;base64,${response.dmi_img}" alt="DMI Verification" style="max-width:100%; height:auto; margin-top: 10px;">
                        </div>
                    </div>
                `;

                $('.chat-card-body').append(dmiImageMessage);
                $('.chat-card-body').scrollTop($('.chat-card-body')[0].scrollHeight);

                sendMessage(senderId, receiverId, message, dmi_img );
                
                $('.transaction-modal-content').addClass('d-none');
                $('#transactionSuccess').removeClass('d-none');
                }
                else {
                    $('.transaction-modal-content').addClass('d-none');
                    $('#transactionFailed').removeClass('d-none');
                }

            },
            error: function (xhr, status, error) {
                $('.transaction-modal-content').addClass('d-none');
                $('#transactionFailed').removeClass('d-none');
            }
        });
        
          
    })


    


 
})


function capitalizeFirts(str){
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}