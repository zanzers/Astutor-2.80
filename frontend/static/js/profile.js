function scriptSetup() {

    $('.userTypeBtn').click(function() {

        const id = $(this).attr('id');
        console.log("click", id)
        $('.choose-container').addClass('d-none');

        if(id === 'studentBtn' || id === 'tutorBtn'){
            $(`.${id === 'studentBtn' ? 'student' : 'tutor'}-container`).removeClass('d-none');
        }
    });
}


// completecd 

    
