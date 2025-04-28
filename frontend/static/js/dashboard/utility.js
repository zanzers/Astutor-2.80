$(document).ready(function() {
    scroll_up();
 const defaultTab = $('.atr-switch-tab_tag.atr-switch-tab_tag-active').data('target');
 if (defaultTab) {
     $('.form-section').addClass('d-none');
     $('#' + defaultTab).removeClass('d-none');
 }

 $('.btn-next').on('click', function () {

    const $currentTab = $('.atr-switch-tab_tag.atr-switch-tab_tag-active');
    const currentTarget = $currentTab.data('target');
    const $currentSection = $('#' + currentTarget);

    if (currentTarget === 'video-section'){
        const videoElem = $('#recordVideo').get(0);
        if(!videoElem.src || videoElem.src === window.location.href){
            $('.video-error')
            .removeClass('d-none')
            .text('Please record a video to proceed.');
            scroll_up();
            return;
        } else {
            $('.video-error').addClass('d-none').text('');
    }
    }

    const inputs = $currentSection.find(':input[required]');

    let allValid = true;
    inputs.each(function () {
        if (!this.checkValidity()) {
            this.reportValidity(); 
            allValid = false;
            return false; 
        }
    });


    if (allValid) {
        const $nextTab = $currentTab.next('.atr-switch-tab_tag');
        if ($nextTab.length > 0) {
            $currentTab.removeClass('atr-switch-tab_tag-active');
            $nextTab.addClass('atr-switch-tab_tag-active');

            const nextTarget = $nextTab.data('target');
            $('.form-section').addClass('d-none');
            $('#' + nextTarget).removeClass('d-none');
            scroll_up()
        }
    }
});


 $('.btn-prev').on('click', function () {
     const $currentTab = $('.atr-switch-tab_tag.atr-switch-tab_tag-active');
     const $prevTab = $currentTab.prev('.atr-switch-tab_tag');

     if ($prevTab.length > 0) {
         $currentTab.removeClass('atr-switch-tab_tag-active');
         $prevTab.addClass('atr-switch-tab_tag-active');

         const target = $prevTab.data('target');
         $('.form-section').addClass('d-none');
         $('#' + target).removeClass('d-none');
     }
 });

    $('.btn-prev-home').on('click', function(){
        window.location.href = `/api/getting-Started`;
    })

})



// call specific route in the getting started 
$(document).ready(function(){
    $('.userTypeBtn').on('click', function(){
        const userType = $(this).attr('id') === 'studentBtn' ? 'student' : 'tutor';
        window.location.href = `/api/getting-started/${userType}`;
    })


})


// photo-clear and preview
$(document).ready(function(){

    const photoInput = $('#profile-photo');
    const clearInput = $('.photo-clear');
    const preview = $('#photo-preview');
    const defaultImg = '/static/slide-img/default-img.png';


    photoInput.on('change', function (){
        const file = this.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function (e){
                preview.attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
            clearInput.show();
        }
    })

    clearInput.on('click', function(){
        photoInput.val('');
        preview.attr('src', defaultImg);
        $(this).hide();
    })
})



function scroll_up(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
}


