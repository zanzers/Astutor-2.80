$(document).ready(function () {
    const id = sessionStorage.getItem("userID");

    const user_data = {
        userID: id
    };

    $.ajax({
        url: "/api/dashboard/students_list",
        type: "POST",
        data: JSON.stringify(user_data),
        contentType: "application/json",
        success: function (response) {
            const container = $(".student-data-list");
            container.empty();

            if (response.length === 0) {
                container.append("<p>No enrolled students yet.</p>");
                return;
            }

            



            response.forEach(student => {
                  const fullName = student.lastName
                        ? `${student.firstName} ${student.lastName}`
                        : `${student.firstName}`;
                const studentCard = `
                    <div class="student-task-card">
                        <img src="${student.image_path}" alt="Profile" class="student-avatar">
                        <div class="student-info">
                            <h4>${fullName}</h4>
                            <p>${student.subject_name}</p>
                            <p><strong>${student.method}</strong> — ${student.time}, ${student.day}</p>
                        </div>
                    </div>
                `;
                container.append(studentCard);
            });
        },
        error: function (err) {
            console.error("Failed to load students", err);
        }
    });
});
