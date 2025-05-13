$(document).ready(function () {

$('.toggle-btn').on('click', function () {
  const $li = $(this).closest('li'); // find the current li
  const $wrapper = $li.find('.topic_discriptio_wrp'); // only affect this li
  $wrapper.toggleClass('truncated expand');

  const isExpanded = $wrapper.hasClass('expand');
});


 $('li').hover(
    function () {
      // Mouse leaves the li
      $(this).find('.topic_discriptio_wrp')
        .removeClass('expand')
        .addClass('truncated');
    }
  );



$(document).on('click', '.view-btn', function () {
    const tutorId = $(this).data('tutorname');
    $('.view_tutor').removeClass('d-none');
    console.log("tutor view", tutorId);
});


$(document).on('click', '.closed_view', function () {
    console.log("CLOSED");
     $('.tutor_card').empty();
    $('.view_tutor').addClass('d-none');
});


$(document).on('click', '.enroled-btn', function () {
    const tutorId = $(this).data('tutorname');
    $('.enrolled_student').removeClass('d-none');
    console.log("tutor view", tutorId);
});


$(document).on('click', '.cancel-btn', function () {
    $('.enrolled_student').addClass('d-none');
});

$(document).on('click', '.enroll-btn.view', function () {
    $('.view_tutor').addClass('d-none');
    $('.enrolled_student').removeClass('d-none');

});



});
