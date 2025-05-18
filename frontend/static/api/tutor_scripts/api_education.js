$(document).ready(function () {
    $('.education-btn').on('click', function () {
        const id = sessionStorage.getItem("userID");  // get userId here
        const allForms = document.querySelectorAll('.education_entry');
        const formData = new FormData();
        formData.append('userId', id);

        allForms.forEach((form) => {
            formData.append('school[]', form.querySelector('#school').value);
            formData.append('degree[]', form.querySelector('#degree').value);
            formData.append('status[]', form.querySelector('#education-status').value);
            formData.append('field_study[]', form.querySelector('#field_study').value);
            formData.append('start_year[]', form.querySelector('#start_year').value);
            formData.append('end_year[]', form.querySelector('#end_year').value);

            const diplomaInput = form.querySelector('#diploma-upload');
            if (diplomaInput && diplomaInput.files.length > 0) {
                formData.append('diploma[]', diplomaInput.files[0]);
            } else {
                formData.append('diploma[]', new Blob([], { type: 'application/octet-stream' }));
            }
        });


        $.ajax({
            url: '/api/getting-started/education',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("Response:", response);
            },
            error: function (xhr) {
                console.error("Error:", xhr.responseText);
            }
        });
    });
});
