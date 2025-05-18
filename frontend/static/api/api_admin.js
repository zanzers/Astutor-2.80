$(document).ready(function(){

    console.log("adminContent")
    

$.ajax({

        url: '/api/admin-content',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            console.log("Students",response.students)
            console.log("Tutors",response.tutors)

             const students = response.students;

    const studentList = $(".total_students");
    studentList.empty(); // clear any existing cards

    students.forEach(student => {
        const fullName = `${student.firstName} ${student.lastName}`;
        const userId = student.user_id;
        const imagePath = student.image_path || "default.jpg"; // fallback image

        // Construct HTML
        const card = `
            <li class="student-card">
                <!-- Right-side dropdown -->
                <div class="student-card__actions">
                    <button class="dropdown-btn">⋮</button>
                    <ul class="dropdown-menu">
                        <li><a href="#" class="delete-student" data-id="${userId}">Delete</a></li>
                    </ul>
                </div>

                <!-- Left-side content -->
                <div class="student-card__content">
                    <img class="student-img" src="${imagePath}" alt="Student Image" />
                    <div class="student-info">
                        <div class="student-name">${fullName}</div>

                        <div class="student-topics">
                            <span>Topics:</span>
                            <span class="topic-tag">Math</span>
                            <span class="topic-tag">Science</span>
                        </div>

                        <div class="student-tutors">
                            <span>Tutors:</span>
                            <img class="tutor-img" src="/backend/user/10/profile.jpg" alt="Tutor 1" />
                            <img class="tutor-img" src="/backend/user/11/profile.jpg" alt="Tutor 2" />
                        </div>
                    </div>
                </div>
            </li>
        `;

        studentList.append(card);
    });

    console.log("Rendered student cards:", students.length);
            
        },
        error: function (xhr, status, error) {
        //   alert('Failed to load load_content_tutor.');
          console.error('Error:', error);
        }

})



})

