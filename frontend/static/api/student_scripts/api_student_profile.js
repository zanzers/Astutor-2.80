$(document).ready(function(){

    const name = sessionStorage.getItem("tempName");
    const email= sessionStorage.getItem("tempEmail");
    const id= sessionStorage.getItem("userID");

    $('#about-form-student').on('submit', function (e){
        e.preventDefault();
        
        const studentData = {
            UserID: id,
            requested_by: "student",
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            email: $('#email').val(),
            
        }
        console.log( "UserID:" , studentData.UserID , "Name: ", studentData.fname, "Last Name: ",studentData.lname, "Email: ",studentData.email, "Subject: ",studentData.subject)


        $.ajax({
            method: "POST",
            url: "/api/getting-started/about",
            contentType: "application/json",
            data: JSON.stringify(studentData),
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




})


// let subjectVal = $('#subject').val();
// if(subjectVal === 'other'){
//     subjectVal = $('#other-subject').val().trim();
// }
// const studentData = {
//     UserID: id,
//     requested_by: "tutor",
//     fname: $('#fname').val(),
//     lname: $('#lname').val(),
//     email: $('#email').val(),
//     subject: subjectVal
// }
// console.log( "UserID:" , studentData.UserID , "Name: ", studentData.fname, "Last Name: ",studentData.lname, "Email: ",studentData.email, "Subject: ",studentData.subject)


// $.ajax({
//     method: "POST",
//     url: "/api/getting-started/about",
//     contentType: "application/json",
//     data: JSON.stringify(studentData),
//     dataType: "json",
//     success: function(response){
//         const fullName = response.data["fullname"];
//         const subject = response.data.subject;
//         $('.fullname').text(fullName);
//         $('.subject').text(subject);

//         sessionStorage.setItem("tutorID", response.data.tutor_id);
   
//     },
//     error: function(xhr, status, error){
        
//     }
// })