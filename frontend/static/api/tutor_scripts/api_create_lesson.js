$(document).ready(function () {

    const name = sessionStorage.getItem("tempName");
    const userId= sessionStorage.getItem("userID");
    const tutorId= sessionStorage.getItem("tutorID");

    
    console.log("create user:", userId);
    
    let requesttutor = {
      tutorId: tutorId
    }
    console.log("create user:", requesttutor.tutorId);


    $.ajax({
      url: "/api/dashboard/topics",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(requesttutor),
      dataType: "json",
      success: function (response) {
    
        console.log("response", response);
        console.log(response.schedule);
    
        $('.selected-val').text(response.default_subject);
        $('#default-rate').val(response.rate);
        $('.selector-menu').empty();
    
        // Eliminate duplicate subjects
        const seenSubjects = new Set();
        response.subjects.forEach(subject => {
          const name = subject.name.trim().toLowerCase();
          if (!seenSubjects.has(name)) {
            seenSubjects.add(name);
            const subjectItem = `
              <div class="selector-menu_section">
                <div class="selector-menu_biz" title="${subject.name}">${subject.name}</div>
              </div>
            `;
            $('.selector-menu').append(subjectItem);
          }
        });
    
      },
      error: function (xhr, status, error) {
        console.error("Error loading tutor info:", error);
      }
    });
    





    $('.pub-button ').on('click', function(e){
        e.preventDefault();

        
        const barter = $('#accept-barter').is(':checked') ? 1 : 0;
        const scheduleSummary = JSON.parse(sessionStorage.getItem('sched'));
        const { subject, topic, description, rate} = extract_values();




        const inputError = checkVal(topic, description);

        if (inputError ) return;


        let createData = {
            subject: subject,
            topic: topic,
            description: description,
            rate: rate,
            barter: barter,
            days: scheduleSummary.days,
            method: scheduleSummary.method,
            time: scheduleSummary.time,
            range: scheduleSummary.range

        };


        console.log("CREATED",createData);

  
        $.ajax({
            url: "/api/dashboard/test1",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(createData),
            dataType: "json",
            success: function(response){

              alert(response.message)
                sessionStorage.removeItem('sched');
                window.location.href = response.return_url;
            },
            error: function(xhr){
                console.error('Failed to save data', xhr.responseJSON || xhr.responseText);
            }
        })

    })




    
  });
  


  function checkVal(topic, description){
    
      let hasError = false;
        
        if (!topic) {
          $('.msg-error-topic').text("Please enter a Topic.").show();
          hasError = true;
      }

      if (!description) {
          $('.msg-error-des').text("Please enter a Description.").show();
          hasError = true;
      }

      return hasError;
  }

  function extract_values() {
    const subject = $('.selected-val').text().trim();
    const topic = $('#topic').val().trim();
    const description = $('#description').val().trim();
    const rate = $('#default-rate').val().trim();
    $('.error').text('').hide();

    return {
        subject,
        topic,
        description,
        rate
    };
}


