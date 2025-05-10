$(document).ready(function(){

    $('.complete_Student').on('click', function(){


        console.log("complete_Student",)
        var userID = sessionStorage.getItem("userID")
        var budgetValue = $('#budgetRange').val();

            const sentBudget = {
                'userID': userID,
                 'budgetValue': budgetValue
            }

            console.log("sentBudget", sentBudget)
            $('#confirmationCard').removeClass('d-none');

             $.ajax({
            url: '/api/dashboard/student_submit',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({sentBudget}),
            success: function(response) {
                console.log('Successfully submitted buget:', response);
                setTimeout(function () {

                $('#confirmationCard').addClass('d-none');
                window.location.href = response.home_url;
                }, 2000); 
            },
            error: function(xhr, status, error) {
                console.error('Error submitting subjects:', error);
            }
        });



    })
})