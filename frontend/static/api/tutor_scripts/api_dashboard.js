$(document).ready(function(){


    const id= sessionStorage.getItem("userID");
    console.log("first", id)

    const profile_path = $('.atr-avatar_img')
    const fullname = $('.userFullname')

    const user_data = {
        userId: id
    }

    $.ajax({

            url: '/api/dashboard/load_profile',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user_data),
            success: function (response) {
                

                console.log("load",response.img_url, response.name )
                profile_path.attr('src', response.img_url)
                fullname.text(response.name)
                $('#rate_count').text(response.per_rate || 0);
                $('#lesson_count').text(response.total_lessons || 0);

            
            },
            error: function (xhr, status, error) {
              alert('Failed to load load_profile.');
              console.error('Error:', error);
            }

    })
    $.ajax({

            url: '/api/dashboard/content',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user_data),
            success: function (response) {
            
                const container = $('.lesson-list_container');
                container.empty(); 

                if (response.length === 0) {
                    container.html("<p class='no-lessons'>No lessons available yet.</p>");
                    return;

                } else {

                     response.forEach(lesson => {

                        const enrolled = lesson.student_list || [];
                        const displayLimit = 4;
                        const displayStudents = enrolled.slice(0, displayLimit);
                        const extraCount = enrolled.length - displayLimit;

                        const enrolledHTML = displayStudents.map(student => `
                            <img
                                src="${student.image_path}" 
                                class="enrolled_profile" 
                                data-id="${student.user_id}" 
                                alt="${student.firstName} ${student.lastName}" 
                                title="${student.firstName} ${student.lastName}"
                            >
                        `).join("");

                        const extraHTML = extraCount > 0 
                            ? `<span class="enrolled_more">+${extraCount} more</span>` 
                            : "";

                        const enrolledSection = enrolled.length > 0 ? `
                                <div class="lesson_topic">Enrolled                              
                                    <div class="enrolled_profile-container">
                                        <div class="enrolled-box">
                                            ${enrolledHTML}
                                            ${extraHTML}
                                        </div>
                                    </div>
                                </div>
                            ` : "";


            const lessonHTML = `
            <div class="lessons-items">
                                        
                     <div class="lesson-wrp">
                         <div class="lesson_header">
                         <h2 class="subject-type"> ${lesson.subject_name}</h2>
                        <div class="option_container">
                         <i class='bx bx-video' data-tooltip="call"></i>
                         <i id="edit-lesson" class='edit-lesson bx bx-dots-horizontal-rounded' data-tooltip="Edit Menu"></i>
                        </div>
                     </div>

                    <div class="lesson-option_dropdown d-none">
                         <span class="dropdown-option edit-option-lesson">Edit</span>
                         <span class="dropdown-option delete-option-lesson">Delete</span>
                     </div>

                    <div class="lesson-body_content">
                                                            
                        <div class="lesson_topic">Topic
                            <div class="topic_container">
                                <div class="topic_box">
                                    ${lesson.topic}   
                                </div>
                            </div>
                        </div>
                        <div class="lesson_topic">Description
                            
                         <div class="description-container">
                             <div class="description-box">
                             ${lesson.description}
                             </div>
                         </div>
                                                                
                         </div>
                        <div class="lesson_topic">Schedule
                                <div class="schedule-con
                                    <div class="schedule-box">
                                        <div class="schedule-days">${lesson.day}</div>
                                        <div class="schedule-method">${lesson.method}</div>
                                        <div class="schedule-time">${lesson.time}</div>
                                      </div>
                                    
                                </div>
                            
                        </div>
                            ${enrolledSection}

                          </div>
                          </div>
                     </div>
            `;
            container.append(lessonHTML); 
        });
                }
            
            },
            error: function (xhr, status, error) {
              alert('Failed to load load_content_tutor.');
              console.error('Error:', error);
            }

    })

    $.ajax({

        url: '/api/dashboard/contact',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(user_data),
        success: function (response) {
            const contactListContainer = $('.ul-list-contact'); 
        
            response.forEach(user => {
                const fullName = `${user.firstName} ${user.lastName}`;
                const userId = user.userId;
                const imagePath = user.image_path;

                console.log("contact", response)
        
                const contactHTML = `
                <li class="contact-list">
                    <div role="button" class="chat_wrp chat_person">
                        <img src="${imagePath}" alt="${fullName}">
                        <div class="contact-info">
                            <span class="contact-name" data-info="${fullName}" data-id="${userId}">${fullName}</span>
                        </div>
                    </div>
                </li>`;
        
                contactListContainer.append(contactHTML);
            });
        },
        error: function (xhr, status, error) {
          alert('Failed to load load_content_tutor.');
          console.error('Error:', error);
        }

})




})