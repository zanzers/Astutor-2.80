$(document).ready(function(){

    console.log("adminContent")
    

    $.ajax({

            url: '/api/admin-content-student',
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

                    const tutorImgs = [...student.tutors.values()]
                    .filter(tutor => tutor && tutor.tutor_id && tutor.tutor_image) // filters out invalid/null entries
                    .map(tutor =>
                        `<img class="tutor-img" src="${tutor.tutor_image}" alt="Tutor ${tutor.tutor_id}" />`
                    )
                    .join("");



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


tutors_list()
request_list()


})



function tutors_list() {
    $.ajax({
        url: '/api/admin-content-tutor',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            const tutors = response.tutors || [];
            const students = response.students || [];

            const tutorList = $(".total_tutors");
            tutorList.find("li:gt(0)").remove(); // clear all but header

            // Group students by tutor_id
            const tutorMap = {};
            students.forEach(student => {
                const tutorId = student.tutor_user_id;
                if (!tutorId) return;

                if (!tutorMap[tutorId]) tutorMap[tutorId] = {
                    topics: new Set(),
                    students: []
                };

                if (student.topic) tutorMap[tutorId].topics.add(student.topic);
                tutorMap[tutorId].students.push({
                    name: student.student_last?.trim()
                        ? `${student.student_first} ${student.student_last}`
                        : student.student_first,
                    image: student.student_image || "default.jpg"
                });
            });

            // Build tutor cards
            tutors.forEach(tutor => {
                const fullName = `${tutor.firstName} ${tutor.lastName}`;
                const image = tutor.image_path || "default.jpg";
                const dataId = tutor.user_id;

                const tutorData = tutorMap[tutor.user_id] || { topics: new Set(), students: [] };

                const topicTags = Array.from(tutorData.topics).map(topic => `<span class="topic-tag">${topic}</span>`).join('') || '<span>No topics</span>';

                const studentImgs = tutorData.students.map(s => `
                    <img class="student-img" src="${s.image}" alt="${s.name}">
                `).join('') || '<span>No students</span>';

                const card = `
                    <li class="student-card">
                        <div class="student-card__actions">
                            <button class="dropdown-btn">⋮</button>
                            <ul class="dropdown-menu">
                                <li><a href="#" class="delete-tutor" data-id="${dataId}">Delete</a></li>
                            </ul>
                        </div>

                        <div class="student-card__content">
                            <img class="student-img" src="${image}" alt="Tutor ${fullName}" />
                            <div class="student-info">
                                <div class="student-name">${fullName}</div>

                                <div class="student-topics">
                                    <span>Topics:</span>
                                    ${topicTags}
                                </div>

                                <div class="student-tutors">
                                    <span>Students:</span>
                                    ${studentImgs}
                                </div>
                            </div>
                        </div>
                    </li>
                `;

                tutorList.append(card);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error loading tutors:', error);
        }
    });
}


function request_list() {
    $.ajax({
        url: '/api/admin-content-request',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            console.log("request_list", response);

            const requestContainer = $('.request-list');
            requestContainer.empty(); // Clear existing entries

            const tutors = response.requested_tutors;

            tutors.forEach(tutor => {
                const fullName = `${tutor.firstName} ${tutor.lastName}`;
                const image = tutor.image_path || 'default.jpg'; // Fallback if no image
                const date = new Date(tutor.request_date).toLocaleDateString();

                const card = `
                    <li class="request-card">
                        <div class="request-card__content">
                            <img class="tutor-img" src="${image}" alt="Tutor Image" />
                            <div class="tutor-info">
                                <div class="tutor-name">${fullName}</div>
                                <div class="request-date">Requested on: ${date}</div>
                            </div>
                            <div class="request-actions">
                                <button class="accept-btn" data-id="${tutor.tutor_id}">Accept</button>
                                <button class="decline-btn" data-id="${tutor.tutor_id}">Decline</button>
                            </div>
                        </div>
                    </li>
                `;

                requestContainer.append(card);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error loading tutor requests:', error);
        }
    });
}
