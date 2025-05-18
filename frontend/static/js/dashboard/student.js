
$(document).ready(function () {
  console.log("Tab system ready");

  // Initial setup: show lessons, hide others
  $('[data-tab-content]').addClass('d-none');
  $('[data-tab-content="lessons"]').removeClass('d-none');

  $('.account-switch-tab_tag').on('click', function () {
    // Remove active class from all tabs
    $('.account-switch-tab_tag').removeClass('account-tab_tab-active');

    // Add active class to clicked tab
    $(this).addClass('account-tab_tab-active');

    // Get the selected tab name from data-tab
    const selectedTab = $(this).data('tab');

    // Show the selected content, hide the rest
    $('[data-tab-content]').each(function () {
      if ($(this).data('tab-content') === selectedTab) {
        $(this).removeClass('d-none');
      } else {
        $(this).addClass('d-none');
      }
    });
  });
});

