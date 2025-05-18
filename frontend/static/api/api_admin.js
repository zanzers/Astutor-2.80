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
            studentList.empty();

    
            const grouped = {};

            students.forEach(row => {
                const studentKey = row.student_user_id;

                if (!grouped[studentKey]) {
                    grouped[studentKey] = {
                        student_id: row.student_id,
                        student_first: row.student_first,
                        student_last: row.student_last,
                        student_image: row.student_image || "default.jpg",
                        user_id: row.student_user_id,
                        topics: new Set(),
                        tutors: new Map()
                    };
                }

                if (row.topic && row.topic.trim()) {
                    grouped[studentKey].topics.add(row.topic.trim());
                }

                const tutorKey = row.tutor_id;
                if (!grouped[studentKey].tutors.has(tutorKey)) {
                    grouped[studentKey].tutors.set(tutorKey, {
                        tutor_id: row.tutor_id,
                        tutor_image: row.tutor_image || "default.jpg"
                    });
                }
            });

 
            Object.values(grouped).forEach(student => {
                const fullName = student.student_last?.trim()
                    ? `${student.student_first} ${student.student_last}`
                    : student.student_first;

                const topicTags = [...student.topics]
                    .map(topic => `<span class="topic-tag">${topic}</span>`)
                    .join("") || "";

                const tutorImgs = student.tutors.size > 0
                    ? [...student.tutors.values()]
                        .map(tutor => `<img class="tutor-img" src="${tutor.tutor_image}" alt="Tutor ${tutor.tutor_id}" />`)
                        .join("")
                    : "";


                const card = `
                    <li class="student-card">
                        <div class="student-card__actions">
                            <button class="dropdown-btn">⋮</button>
                            <ul class="dropdown-menu">
                                <li><a href="#" class="delete-student" data-id="${student.user_id}">Delete</a></li>
                            </ul>
                        </div>

                        <div class="student-card__content">
                            <img class="student-img" src="${student.student_image}" alt="Student Image" />
                            <div class="student-info">
                                <div class="student-name">${fullName}</div>

                                <div class="student-topics">
                                    <span>Topics:</span>
                                    ${topicTags}
                                </div>

                                <div class="student-tutors">
                                    <span>Tutors:</span>
                                    ${tutorImgs}
                                </div>
                            </div>
                        </div>
                    </li>
                `;

                studentList.append(card);
            });

            console.log("Rendered student cards:", Object.keys(grouped).length);

        },
        error: function (xhr, status, error) {
        //   alert('Failed to load load_content_tutor.');
          console.error('Error:', error);
        }

})



})

