$(document).ready(function(){
        const id= sessionStorage.getItem("userID");


        const userId = {
            UserID: id,
            
        }

            $.ajax({
                url: "/api/students/lessons_list",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(userId),
                dataType: "json",
                success: function(response){

                    console.log("lessons_list", response)
                    $(".tutor_lessons-list").empty();


                    response.forEach(lesson => {

                        const imgSrc = lesson.image_path
                        const tutorFullName = `${lesson.firstName || ""} ${lesson.lastName || ""}`.trim();
                        $('#lesson_count_students').text(lesson.total_lessons_per_tutor)
                        $('#student_count-tutors').text(lesson.total_lessons_per_tutor)
                        const lessonsCard = `
                            <li>
                                <div class="tutor_card">
                                    <div class="card-icons">
                                    <i class="bi bi-camera-video" title="Join Video Call"></i>
                                    <i class="bi bi-list-task" title="View Tasks"></i>
                                    </div>

                                    <div class="card-body">
                                    <div class="left-col">
                                        <img src="${imgSrc}" alt="${tutorFullName}" class="student-avatar" />
                                        <p class="tutor-name">${tutorFullName}</p>
                                    </div>
                                    <div class="right-col">
                                        <h4 class="lesson-topic">${lesson.topic}</h4>
                                        <p class="tutor_details"><strong>Day:</strong> ${lesson.day}</p>
                                        <p class="tutor_details"><strong>Time:</strong> ${lesson.time}</p>
                                        <p class="tutor_details"><strong>Method:</strong> ${lesson.method}</p>
                                    </div>
                                    </div>
                                </div>
                             </li>
                             `;

                     $(".tutor_lessons-list").append(lessonsCard);

                    });
           
                },
            error: function(xhr, status, error){
                
                }
         })

})