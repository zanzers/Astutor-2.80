$(document).ready(function(){

    console.log("tutor_notifications")

    const id= sessionStorage.getItem("userID");

    const user_data = {
        userID: id
    }

          $.ajax({
            url: "/api/dashboard/tutor_notifications",
            type: "POST",
            data: JSON.stringify(user_data),
            contentType: "application/json",
            success: function(response) {

                const notification_list = response.result;
                console.log("notification_list", notification_list)

                    notification_list.forEach(item => {
                        const card = `
                            <li class="notification-card">
                                <div class="notif-header">
                                    <img src="${item.image_path}" alt="Student Image" class="student-avatar">
                                    <div class="notif-text">
                                        <p><strong>${item.student_firstName}</strong> wants to enroll in your lesson: <strong>${item.topic}</strong></p>
                                    </div>
                                </div>
                                <div class="notif-details">
                                    <span><i class='bx bx-time'></i> ${item.time}</span>
                                    <span><i class='bx bx-calendar'></i> ${item.day}</span>
                                    <span><i class='bx bx-video'></i> ${item.method}</span>
                                    <span><i class='bx bx-user'></i> ${item.total_enrolled} students</span>
                                </div>
                                <div class="notif-actions">
                                    <button class="accept-btn" data-enroll_id="${item.enroll_id}" data-student_id="${item.student_id}">Accept</button>
                                    <button class="decline-btn" data-enroll_id="${item.enroll_id}" data-student_id="${item.student_id}">Decline</button>
                                </div>
                            </li>`;
                        $(".notitication-list").append(card);
                    });
               
            },
            error: function(err) {
                console.error("Failed to load messages", err);
            }
        });




        $(document).on("click", ".accept-btn", function () {
         
            const enrollId = $(this).data("enroll_id");
            const studentId = $(this).data("student_id");
            updateEnrollStatus(enrollId, studentId, 1);
        });

        $(document).on("click", ".decline-btn", function () {
        
            const enrollId = $(this).data("enroll_id");
            const studentId = $(this).data("student_id");
            updateEnrollStatus(enrollId, studentId, 0);
        });

        

function updateEnrollStatus(enrollId, studentId, approveStatus) {


    const enrolle = {
        enrollId: enrollId,
        approveStatus: approveStatus,
        studentId: studentId
    }


    $.ajax({
        url: "/api/dashboard/enroll_action",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(enrolle),
        success: function (response) {
            console.log("Updated successfully", response);
     
            $(`[data-enroll_id="${enrollId}"]`).closest(".notification-card").remove();
             const message = approveStatus === 1 
                ? "Student enrollment accepted." 
                : "Student enrollment declined.";

           
          const notificationCard = $(`
                <div class="simple-notification">
                    <p>${message}</p>
                </div>
            `);
            $("body").append(notificationCard);

            setTimeout(() => {
                notificationCard.css("opacity", "0");
                setTimeout(() => {
                    notificationCard.remove();
                }, 500);
            }, 3000);

        },
        error: function (err) {
            console.error("Error updating enrollment", err);
        }
    });
}


})