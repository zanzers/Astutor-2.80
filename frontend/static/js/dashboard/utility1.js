$(document).ready(function() {

    scroll_up();
 const defaultTab = $('.atr-switch-tab_tag.atr-switch-tab_tag-active').data('target');
 if (defaultTab) {
     $('.form-section').addClass('d-none');
     $('#' + defaultTab).removeClass('d-none');
 }

 $('.btn-next').on('click', function () {

        const $currentTab = $('.atr-switch-tab_tag.atr-switch-tab_tag-active');
        const $nexTab = $currentTab.next('.atr-switch-tab_tag');

        if ($nexTab.length > 0){


            $currentTab.removeClass('atr-switch-tab_tag-active');
            $nexTab.addClass('atr-switch-tab_tag-active');

            const target = $nexTab.data('target')

            $('.form-section').addClass('d-none');
            $('#' + target).removeClass('d-none');

            scroll_up();

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


