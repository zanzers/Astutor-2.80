$(document).ready(function(){

    const id= sessionStorage.getItem("userID");
    const name= sessionStorage.getItem("tempName");
    const email= sessionStorage.getItem("tempEmail");


    $('#fname').val(name);
    $('#email').val(email);
    





    $('#about-form-student').on('submit', function(e) {
        e.preventDefault(); // prevent page reload

        const fname = $('#fname').val();
        const lname = $('#lname').val();
        const email = $('#email').val();

        console.log("First Name:", fname);
        console.log("Last Name:", lname);
        console.log("Email:", email);
    });









})