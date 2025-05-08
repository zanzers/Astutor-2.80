$(document).ready(function () {

    const name = sessionStorage.getItem("tempName");
    const email= sessionStorage.getItem("tempEmail");
    const id= sessionStorage.getItem("userID");
    
    
    $('#confirm-age').prop('checked', true);
    if(name && email){
        $('#fname').val(name);
        $('#email').val(email);

    }



    // SUBJECT FETCH
    $.ajax({
        url: "/api/getting-started/subjects",
        method: "GET",
        dataType: "json",
        success: function(response){
            const subjectSelected = $('#subject');
            subjectSelected.empty();
            subjectSelected.append(`<option value=""> Select a subject </option>`);

            console.log(response.subjects)

            response.subjects.forEach(subject => {
                subjectSelected.append(`<option value=${subject.name}>${subject.name}</option>`)
            });

            subjectSelected.append(`<option value="other">Other</option>`)

        },
        error: function(xhr, status, error) {
            console.log("Failed to load subjects", error);
        }
    });


    // SUBJECT OTHER OPTION and Insert
    $('#subject').on('change', function(){
        const selectedVal = $(this).val();
        if(selectedVal === 'other'){
            $('#other-subject-group').show();
            $('#other-subject').val('').attr('required', true);
        } else {
            $('#other-subject-group').hide();
            $('#other-subject').val('').attr('required', false); 
        }
    })


    $('#about-form-tutor').on('submit', function (e){
        e.preventDefault();
        
        let subjectVal = $('#subject').val();
        if(subjectVal === 'other'){
            subjectVal = $('#other-subject').val().trim();
        }
        const aboutData = {
            UserID: id,
            requested_by: "tutor",
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            email: $('#email').val(),
            subject: subjectVal
        }
        console.log( "UserID:" , aboutData.UserID , "Name: ", aboutData.fname, "Last Name: ",aboutData.lname, "Email: ",aboutData.email, "Subject: ",aboutData.subject)


        $.ajax({
            method: "POST",
            url: "/api/getting-started/about",
            contentType: "application/json",
            data: JSON.stringify(aboutData),
            dataType: "json",
            success: function(response){
                const fullName = response.data["fullname"];
                const subject = response.data.subject;
                $('.fullname').text(fullName);
                $('.subject').text(subject);

                sessionStorage.setItem("tutorID", response.data.tutor_id);
           
            },
            error: function(xhr, status, error){
                
            }
        })

    
    })

    // SENT PHOTO-DATA ************
    $('.profile-btn').on('click', function(e){
        e.preventDefault();
        console.log("profile-btn")

        const file = $('#profile-photo')[0].files[0];

        if (!file || !id) return;
        const ext = file.name.split('.').pop();
        const newName = `${id}_profile.${ext}`;
        const renameFile = new File([file], newName, {type: file.type});

        console.log("PHOTO-data", renameFile, newName, file);


        const formData = new FormData();
        formData.append('profile-photo', renameFile);
        formData.append('userId', id);
        formData.append("type", "profile");
    
        $.ajax({
            method: "POST",
            url: "/api/getting-started/photo",
            data: formData,
            contentType: false,      
            processData: false,     
            success: function (response) {
                const imgURL = `${response.image_url}?t=${new Date().getTime()}`;

                $('#photo-preview').attr('src', imgURL);
                $(".atr-avatar_img").attr("src", imgURL);
                
            },
            error: function (xhr, status, error) {
                console.error("Upload error:", error);
            }
        });
        
    })

    // DIPLOMA UPLOAD
    $('#diploma-upload').on('change', function(){
        const file = this.files[0];
        if(!file) return;

        const formData = new FormData();
        formData.append('profile-photo', file);
        formData.append('userId', id);
        formData.append("type", "diploma");

        
        $.ajax({
            method: "POST",
            url: "/api/getting-started/photo",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("Diploma uploaded:", response.image_url);
            },
            error: function (xhr) {
                console.error("Upload error:", xhr.responseText);
            }
        })

    
    })

});
