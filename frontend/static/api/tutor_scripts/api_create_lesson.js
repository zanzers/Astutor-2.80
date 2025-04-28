$(document).ready(function () {

    const name = sessionStorage.getItem("tempName");
    const userId= sessionStorage.getItem("userID");
    const tutorId= sessionStorage.getItem("tutorID");

    // request the subject of the user 
    // fectch all the subjects in the db and provide the defaul price
    // see the tutor_routes line 88 for more info. 
    // Note that the expected return are already define their just update() and change everything.
    
    console.log("create user:", userId);
    console.log("create user:", tutorId);

    let requesttutor = {
      tutorId: tutorId
    }

    // Update this see line 90 for the expected value
    // request 
    $.ajax({
      url: "/api/dashboard/test",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(requesttutor),
      dataType: "json",
      success: function (response) {

        console.log("response",response)
        console.log(response.schedule);

        $('.selected-val').text(response.default_subject);
        $('.sched-val').text(response.schedule);
        $('#default-rate').val(response.rate);
        $('.selector-menu').empty();

        response.subjects.forEach(subject => {
          const subjectItem = `
            <div class="selector-menu_section">
              <div class="selector-menu_biz" title="${subject}">${subject}</div>
            </div>
          `;
          $('.selector-menu').append(subjectItem);
        });

        
        
        $('.sched-val').text(response.schedule[0]);
        if (response.schedule.length > 1) {
          $('.shed-menu').empty();
   
          response.schedule.forEach((schedule) => {
              const scheduleItem = `
                  <div class="shed-menu_section">
                      <div class="shed-menu_biz" title="${schedule}">${schedule}</div>
                  </div>
              `;
              $('.shed-menu').append(scheduleItem); 
          });
      
         
          $('.sched-val').text(response.schedule[0]);
      } else {
          $('.shed-menu').addClass('d-none'); 
      }
      
      },
      error: function (xhr, status, error) {
        console.error("Error loading tutor info:", error);
      }
    });


    $('.pub-button ').on('click', function(e){
        e.preventDefault();

        let hasError = false;
        const subject = $('.selected-val').text().trim();
        const topic = $('#topic').val().trim();
        const description = $('#description').val().trim();
        const rate = $('#default-rate').val().trim();
        $('.error').text('').hide();

      
        if (!topic) {
          $('.msg-error-topic').text("Please enter a Topic.").show();
          hasError = true;
      }
  
      if (!description) {
          $('.msg-error-des').text("Please enter a Description.").show();
          hasError = true;
      }

      if (hasError) return;

        let createData = {
            subject: subject,
            topic: topic,
            description: description,
            rate: rate
        }

        console.log(createData);

        // Update this
        $.ajax({
            url: "/api/dashboard/test1",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(createData),
            dataType: "json",
            success: function(response){

                window.location.href = response.return_url;
            },
            error: function(xhr){
                console.error('Failed to save data', xhr.responseJSON || xhr.responseText);
            }
        })

    })
  });
  

