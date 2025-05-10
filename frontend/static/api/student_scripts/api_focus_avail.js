$(document).ready(function(){

    const userID = sessionStorage.getItem('userID');

    $.ajax({

        url: '/api/dashboard/focus',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
      
                const subjectsWrp = $('.subjects_wrp');
                subjectsWrp.empty();

                response.forEach(subject => {
                    const subjectBtn = $(`
                        <button type="button" class="subject-box" data-subject-id="${subject.subject_id}" data-subject-name="${subject.subject_name}">
                            <span class="subject_name">${subject.subject_name}</span>
                        </button>
                    `);
                    subjectsWrp.append(subjectBtn);
                });

                let selectedSubjects = new Set();
              $(document).on('click', '.subject-box', function () {
                    const subjectName = $(this).text().trim();

                    $(this).toggleClass('active');

                    if ($(this).hasClass('active')) {
                        selectedSubjects.add(subjectName);
                    } else {
                        selectedSubjects.delete(subjectName);
                    }

                    const topicsWrp = $('.topics_wrp');
                    topicsWrp.empty();

        
                    selectedSubjects.forEach(name => {
                        const subject = response.find(sub => sub.subject_name === name);
                        if (subject && subject.topics.length > 0) {
                            subject.topics.forEach(topic => {
                                const topicItem = $(`<button type="button" class="topics">
                                       <span class="topic_name">${topic}</span></button>`);
                                topicsWrp.append(topicItem);
                            });
                        }
                        console.log("selectedSubjects", selectedSubjects)
                    });

                 
                    if (topicsWrp.children().length > 0) {
                        $('.topics_container').removeClass('d-none');
                    } else {
                        $('.topics_container').addClass('d-none');
                    }
            });

            $(document).on('click', '.topics', function () {
                $(this).toggleClass('active_topics'); 
                const selectedTopics = $('.topics.active_topics').map(function() {
                    return $(this).text(); 
                }).get();
                
                console.log('Selected Topics:', selectedTopics);
            });

            
          

        },
        error: function (xhr, status, error) {
          alert('Failed to load load_content_tutor.');
          console.error('Error:', error);
        }

})


    $('.focus-btn').on('click', function(){
         const selectedSubjects = $('.subject-box.active').map(function() {
            return $(this).data('subject-name');  
        }).get();

        console.log('Selected Subjects:', selectedSubjects, "userID", userID);

        const selected = {
            'userID': userID,
            'selectedSubjects':selectedSubjects
        }

         $.ajax({
            url: '/api/dashboard/student_submit',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({selected}),
            success: function(response) {
                console.log('Successfully submitted subjects:', response);
            },
            error: function(xhr, status, error) {
                console.error('Error submitting subjects:', error);
            }
        });

    })

    



})

