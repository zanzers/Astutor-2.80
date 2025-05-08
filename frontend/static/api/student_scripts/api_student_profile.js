$(document).ready(function () {
    console.log("Student")
    const selectedSubjects = [];
    const name = sessionStorage.getItem("tempName");
    const email= sessionStorage.getItem("tempEmail");
    const id= sessionStorage.getItem("userID");
    
    
    $('#confirm-age').prop('checked', true);
    if(name && email){
        $('#fname').val(name);
        $('#email').val(email);

    }


    $('#about-form-student').on('submit', function (e){
        e.preventDefault();
        

        const aboutData = { 
            UserID: id,
            requested_by: "student",
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            email: $('#email').val(),
        }
        console.log( "UserID:" , aboutData.UserID , "Name: ", aboutData.fname, "Last Name: ",aboutData.lname, "Email: ",aboutData.email,)


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


  $('.subject-box').on('click', function () {
    const subject = $(this).data('subject');
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
      if (!selectedSubjects.includes(subject)) {
        selectedSubjects.push(subject);
      }
    } else {
      const index = selectedSubjects.indexOf(subject);
      if (index > -1) {
        selectedSubjects.splice(index, 1);
      }
    }

    console.log('Selected Subjects:', selectedSubjects);
   
  });

});
