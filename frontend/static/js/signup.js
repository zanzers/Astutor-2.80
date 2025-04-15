function initSignupFunc(){
    let name = $(".name input");
    let emailInput = $(".email input");
    let passwordInput = $(".password input");
    let submitBtn = $(".submit-btn");

    submitBtn.addClass("disable-btn");


    function checkFields() {
        let allFilled = emailInput.val().trim() !== "" &&
                        passwordInput.val().trim() !== "" &&
                        name.val().trim() !== "";

        submitBtn.toggleClass("disable-btn", !allFilled).prop("disabled", !allFilled);
    }



    $(".password input").on("input", function () {
        let toggleIcon = $(this).siblings(".password-toggle");
        if ($(this).val().trim() !== "") {
            toggleIcon.removeClass("hidden"); 
        } else {
            toggleIcon.addClass("hidden");
        }
    });

    $(".password-toggle").on("click", function () {
        let passwordInput = $(this).siblings("input");
        let showIcon = $(this).find(".show-icon");
        let hideIcon = $(this).find(".hide-icon");

        if (passwordInput.attr("type") === "password") {
            passwordInput.attr("type", "text");
            showIcon.addClass("hidden");
            hideIcon.removeClass("hidden");
        } else {
            passwordInput.attr("type", "password");
            hideIcon.addClass("hidden");
            showIcon.removeClass("hidden");
        }
    });



    emailInput.on("input", checkFields);
    passwordInput.on("input", checkFields);
    name.on("input", checkFields);
}