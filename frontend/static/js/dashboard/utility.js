$(document).ready(function() {
    $('.atr-switch-tab_tag').on('click', function() {
        $('.atr-switch-tab_tag').removeClass('atr-switch-tab_tag-active');
        $(this).addClass('atr-switch-tab_tag-active');
    

        const target = $(this).data('target');
        $('.form-section').addClass('d-none');
        $('#' + target).removeClass('d-none');
    })

    const defaultTab = $('.atr-switch-tab_tag.atr-switch-tab_tag-active').data('target');
    if(defaultTab){
        $('.form-section').addClass('d-none');
        $('#' + defaultTab).removeClass('d-none');
    }
})