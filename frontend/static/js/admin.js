$(document).ready(function () {
  console.log("Tab system ready");

  $('[data-tab-content]').addClass('d-none');
  $('[data-tab-content="students"]').removeClass('d-none');

  $('.account-switch-tab_tag').on('click', function () {
    $('.account-switch-tab_tag').removeClass('account-tab_tab-active');
    $(this).addClass('account-tab_tab-active');
    const selectedTab = $(this).data('tab');

    $('[data-tab-content]').each(function () {
      if ($(this).data('tab-content') === selectedTab) {
        $(this).removeClass('d-none');
      } else {
        $(this).addClass('d-none');
      }
    });
  });
});
