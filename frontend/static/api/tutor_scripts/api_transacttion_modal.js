$(document).ready(function(){
    const tutorID= sessionStorage.getItem("tutorID");
    console.log("verify_data")

    $('.verify-button').on('click', function(){


        const t_fname = $('#transaction-fname').val()
        const t_lname = $('#transaction-lname').val()
        const t_email = $('#transaction-email').val()
        const t_number = $('#transaction-number').val()


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
        
                if (response.success){
                    const dmiImageMessage = `
                    <div class="chat-message chat-message-sent">
                        <div class="chat-msg-content">
                            <p>Your identity has been verified by DMI ✔</p>
                            <img src="data:image/png;base64,${response.dmi_img}" alt="DMI Verification" style="max-width:100%; height:auto; margin-top: 10px;">
                        </div>
                    </div>
                `;

                $('.chats-wrp').append(dmiImageMessage);
                $('.chats-container').scrollTop($('.chats-container')[0].scrollHeight);
                
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