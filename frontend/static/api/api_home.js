
$(document).ready(function(){


  let enroledUser = null;
  let tutorView = null;
  const id= sessionStorage.getItem("userID");
  console.log("first", id)
  const user_data = {
        userId: id
    }
    console.log("HOME Nowelllllll")

    $.ajax({

            url: '/api/Astutor/load-content',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user_data),
            success: function (response) {
              
              const recommendedGroup = response.recommended;

              const recommendedList = recommendedGroup.recommendations;
              const othersList = recommendedGroup.others;

              const tutor_ul = $('.recomended_ul');
              console.log("reposense", response)
              console.log("recommendedList", recommendedGroup)
              tutor_ul.empty();

              recommendedList.forEach(tutor =>{
                const tutorCards = generateTutorCard(tutor, true);
                tutor_ul.append(tutorCards);
              })

              othersList.forEach(tutor =>{
                const tutorCards = generateTutorCard(tutor, false);
                tutor_ul.append(tutorCards);
              })
            
            



                            
            },
            error: function (xhr, status, error) {
              // alert('Failed to load home.');
           
              console.log("No recommended tutors found.");
              console.error('Error:', error);
            }

    })

  
     $.ajax({

            url: '/api/Astutor/load-top',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user_data),
            success: function (response) {
              
              
              renderTopTutors(response.topTutors);
              console.log("TUTORs", response.topTutors)
        
                            
            },
            error: function (xhr, status, error) {
              // alert('Failed to load home.');
           
              console.log("No recommended tutors found.");
              console.error('Error:', error);
            }

    })


    $(document).on('click', '.view-btn', function () {
        const scheduleId = $(this).data('schedule-id')       

        const schedule_Id = {
            scheduleId: scheduleId
        }
        console.log('Schedule ID:', schedule_Id);

           $.ajax({

            url: '/api/Astutor/view-tutor',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(schedule_Id),
            success: function (response) {

              tutorView = response[0];
              console.log("result", tutorView)

             
                const tutorHTML = `
                  <div class="tutor_left">
                    <div class="tutor_contaienr-wrp">
                      <img src="${tutorView.image_path}" alt="Tutor Photo" class="tutor_img">
                      <div class="fullname">${tutorView.lastName}, ${tutorView.firstName}</div>
                      <div class="teach"><i class='bx bxs-graduation'></i> ${tutorView.subject_name}</div>
                      <div class="tutor_actions">

                                <button class="chat-btn chat_person">
                        <img src="${tutorView.image_path}" alt="${tutorView.lastName}, ${tutorView.firstName}" class="d-none">
                        <div class="contact-info d-none">
                            <span class="contact-name" data-info="${tutorView.lastName}, ${tutorView.firstName}" data-id="${tutorView.id}"></span>
                        </div>
                        Chat</button>

                
                        <button class="enroll-btn enroll" data-schedule_id="${tutorView.schedule_id}">Enroll</button>
                      </div>
                    </div>

                    <div class="about_me">
                      <h4>About Me</h4>
                      <p class="about_text">${tutorView.about || 'No description available.'}</p>
                      <div class="video_container">
                        <iframe 
                          src="https://www.youtube.com/embed/tcqiJAqjoxE"
                          frameborder="0"
                          allowfullscreen
                          class="video_embed"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  <div class="horizotal_line"></div>

                  <div class="closed_view">
                    <i class='bx bx-x view'></i>
                  </div>

                  <div class="tutor_right">
                    <div class="info_container">
                      <div class="tutor_topic excusive">${tutorView.topic}
                        <div class="seperator"></div>
                        <div class="description">
                          <div class="topic_discriptio_wrp truncated topic_view">
                            <div class="tutor_content topic_content">${tutorView.description}</div>
                          </div>
                        </div>
                      </div>

                      <div class="tutor_details view">
                        <small>
                          <span class="peso_icon">&#8369;</span> <span class="info">${tutorView.per_rate}</span>
                        </small>
                        <small>
                          <i class='details_icon bx bxs-user'></i> <span class="info">${tutorView.student_count}</span>
                        </small>
                        <small>
                          <i class='details_icon bx bxs-time-five'></i> <span class="info">${tutorView.time}</span>
                        </small>
                        <small>
                          <i class='details_icon bx bxs-id-card'></i> <span class="info">${tutorView.method}</span>
                        </small>
                        <small>
                          <i class='details_icon bx bxs-calendar'></i> <span class="info">${tutorView.day}</span>
                        </small>
                      </div>
                    </div>
                  </div>
                `;

             
                      $('.tutor_card').empty().append(tutorHTML);
                      $('.view_tutor').removeClass('d-none'); // Optional: show the view if hidden


                            
            },
            error: function (xhr, status, error) {
              // alert('Failed to load home.');
           
              console.log("No recommended tutors found.");
              console.error('Error:', error);
            }

    })
    });

    
    $(document).on('click', '.enroll', function(){

      
        $('.view_tutor').addClass('d-none');
       $('.enrolled_student').removeClass('d-none');
        const enrolledId = $(this).data('schedule_id')

        console.log("schedule_id",enrolledId )
  

        enroledUser  = {
          id: id,
          enrolledId: enrolledId
        }

        console.log("enroledUser", enroledUser)
        console.log('Full tutorView:', tutorView); 

        const enroledStudent  = `
           <h3>Would you like to enroll with this tutor?</h3>
            <div class="enroll_card">
              <div class="enroll_left">
                <img src="${tutorView.image_path}" alt="${tutorView.firstName}" class="tutor_img">
                <div class="tutor_name">${tutorView.lastName}, ${tutorView.firstName}</div>
                  <div class="teach"><i class='bx bxs-graduation'></i> ${tutorView.subject_name}</div>
                  </div>

                  <div class="horizotal_line"></div>

          

              <div class="enroll_right">
                <div class="tutor_subject">
                  <div class="tutor_topic">
                    <span class="topic_tile"Topic</span>
                    <span>
                      ${tutorView.topic}
                    </span>
                  </div>
                  
                </div>
                <div class="tutor_rate">
                  <span class="topic_tile">Rate: </span>
                    <span>
                   ${tutorView.per_rate}
                    </span>
                </div>
              </div>
            </div>
            <div class="enroll_actions">
              <button class="cancel-btn">Cancel</button>
              <button class="confirm-btn">Confirm</button>
            </div>
          `;
           $('.enrolled_student_wrp').empty().append(enroledStudent);


           
      $(document).on('click', '.confirm-btn', function () {
        console.log("enroledUser ", enroledUser  );



            $.ajax({

            url: '/api/Astutor/enrolled-student',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(enroledUser),
            success: function (response) {

                $('.enrolled_student_wrp').addClass('d-none');
                $('.request_sent').removeClass('d-none');
  
                 setTimeout(() => {
                location.reload();
              }, 1500);


                            
            },
            error: function (xhr, status, error) {
       
           
              console.log("No recommended tutors found.");
              console.error('Error:', error);
            }

    })

      });
    })

    
});



function renderTopTutors(tutors) {
  const container = $('.top_tutors');
  container.empty();


  const topTutors = tutors
    .filter(t => t.is_top)
    .sort((a, b) => b.total_students - a.total_students);

  const otherTutors = tutors.filter(t => !t.is_top);
  

 
  topTutors.forEach((tutor, index) => {
    const rankClass = index === 0
      ? 'rank1st'
      : index === 1
      ? 'rank2nd'
      : 'rank3rd'; 

    const profileHTML = `
      <li>
        <div class="tutor_profile">
          <span class="rank">
            <i class='bx bx-medal ${rankClass}'></i>
          </span>
          <img src="${tutor.image_path}" alt="${tutor.full_name}">
          <div class="tutor_details-top">
            <span class="fullname">${tutor.full_name}</span>
            <span class="teach">
              <i class='bx bxs-graduation'></i> ${tutor.subject_name}
            </span>
            <span class="student_total">
              <i class='bx bxs-user'></i> ${tutor.total_students > 100 ? '100+' : tutor.total_students}
            </span>
          </div>
        </div>
      </li>
    `;
    container.append(profileHTML);
  });


  otherTutors.forEach(tutor => {
    const profileHTML = `

    <li>
        <div class="tutor_profile">
          <span class="rank">
            <i class='bx bx-medal d-none'></i>
          </span>
          <img src="${tutor.image_path}" alt="${tutor.full_name}">
          <div class="tutor_details-top">
            <span class="fullname">${tutor.full_name}</span>
            <span class="teach">
              <i class='bx bxs-graduation'></i> ${tutor.subject_name}
            </span>
            <span class="student_total">
              <i class='bx bxs-user'></i> ${tutor.total_students > 100 ? '100+' : tutor.total_students}
            </span>
          </div>
        </div>
      </li>
    `;
    container.append(profileHTML);
  });
}


function generateTutorCard(tutor, isRecommended) {

    return `
        <li class="tutors-cards" data-cards="${tutor.schedule_id}">
            <div class="info_continear">
                <div class="tuto-profile">
                    ${isRecommended ? `<span class="recomendation_hightlight">recommended</span>` : ``}
                    <div class="tutor_info">
                        <img src="${tutor.tutor_profile.img_path}" alt="${tutor.tutor_profile.img_path}" data-tutor_img="${tutor.tutor_profile.img_path}">
                        <div class="tutor_name">
                            <span class="fullname" data-fullname="${tutor.tutor_profile.fullname}">${tutor.tutor_profile.fullname}</span>
                            <span class="tutuor_sub"><i class='bx bxs-graduation' style='color:#ffffff'></i> ${tutor.tutor_profile.subjects.join(', ')}</span>
                        </div>
                    </div>
                    <div class="tutor_btn">
                        <button class="view-btn" data-schedule-id="${tutor.schedule_id}">View</button>
                       
                        <button class="chat-btn chat_person">
                        <img src="${tutor.tutor_profile.img_path}" alt="${tutor.tutor_profile.fullname}" class="d-none">
                        <div class="contact-info d-none">
                            <span class="contact-name" data-info="${tutor.tutor_profile.fullname}" data-id="${tutor.userID}"></span>
                        </div>
                        Chat</button>
              
                    </div>
                </div>

                <div class="info_section">
                    <div class="info_container">
                        <div class="tutor_topic excusive"> 
                            ${tutor.details.topic}
                            <div class="seperator"></div>
                            <div class="description">
                                <div class="topic_discriptio_wrp truncated">
                                    <div class="tutor_content">${tutor.details.description}</div>
                                </div>
                                <button class="view-btn decs" data-schedule-id="${tutor.schedule_id}">View more</button>
                            </div> 
                        </div>       
                    </div>
                </div>
                <div class="separator"></div>
            </div>
        </li>
    `;
}
