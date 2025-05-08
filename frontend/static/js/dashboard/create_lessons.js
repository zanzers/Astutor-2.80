$(document).ready(function(){

  const maxLength = 200;
  const textLength = 200;


  $('#default-rate').on('input', function () {
    const val = parseInt($(this).val(), 10);
  
    if (val > 9000) {
      $(this).val(9000);
    } else if (val < 0 || isNaN(val)) {
      $(this).val('');
    }
  });
  
$('#description').on('input', function () {
  const currentVal = $(this).val();

  if (currentVal.length > textLength) {
    $(this).val(currentVal.slice(0, textLength));
  }

  const currentLength = $(this).val().length;
  $('.quill-editor_count').text(`${currentLength}/${textLength}`);

  if (currentLength >= textLength) {
    $('.quill-editor_count').addClass('limit-reached');
  } else {
    $('.quill-editor_count').removeClass('limit-reached');
  }
});


$('#description').on('keypress', function (e) {
  if ($(this).val().length >= textLength) {
    e.preventDefault();
  }
});


$('#description').on('paste', function (e) {
  e.preventDefault();
  const pasted = (e.originalEvent || e).clipboardData.getData('text');
  const currentValue = $(this).val();
  const allowed = pasted.slice(0, textLength - currentValue.length);
  $(this).val(currentValue + allowed).trigger('input');
});

  $('#topic').on('input', function(){

    const currentlength = $(this).val().length;
    $(this).siblings('.count-tip').text(`${currentlength}/${maxLength}`);

    if(currentlength >= maxLength){
      $(this).siblings('.count-tip').addClass('limit-reached');
    } else {
      $(this).siblings('.count-tip').removeClass('limit-reached');
    }
   });

  $('#topic').on('paste', function (e) {
    e.preventDefault();
    const pasted = (e.originalEvent || e).clipboardData.getData('text');
    const currentValue = $(this).val();
    const allowed = pasted.slice(0, maxLength - currentValue.length);
    $(this).val(currentValue + allowed).trigger('input');
    });


  $('.userSwap').hover(
        function () {
          $(this).find('.float-dialog').stop(true, true).fadeIn(150);
        },
        function () {
          $(this).find('.float-dialog').stop(true, true).fadeOut(150);
        }
     );
      
  $('.atr-button').on('click', function(){
            window.location.href = `/api/dashboard/create-lesson`;
    })

  $('.subject-selected').on('click', function(e){

            $('.selector-menu').toggleClass('d-none')
            $('.down-arrow-icon').toggleClass('upward')
   })

  $('.back_dashboard').on('click', function(){
          window.location.href = `/api/dashboard/Astutor-tutor`;
  })   


$('.day-btn').on('click', function () {
  if ($(this).hasClass('disabled')) return; 
  $(this).toggleClass('selected');
  updateSetAvailabilityState();
});

$('.pref-btn').on('click', function () {
  if ($(this).hasClass('disabled')) {
    $(this).removeClass('selected');
  } else {
    $('.pref-btn').removeClass('selected');
    $(this).addClass('selected');
  }
  updateSetAvailabilityState();
});

$('.time-btn').on('click', function () {
  if ($(this).hasClass('selected')) {
    $(this).removeClass('selected');
  } else {
    $('.time-btn').removeClass('selected');
    $(this).addClass('selected');
  }
  updateSetAvailabilityState();
});


$('#setsched_Btn').on('click', function () {
      $('.sched-summary-list').removeClass('d-none');

      const days = $('.day-btn.selected').map((_, el) => $(el).data('day')).get();
      const methodBtn = $('.pref-btn.selected');
      const method = methodBtn.data('pref');

      const timeBtn = $('.time-btn.selected');
      const label = timeBtn.clone().children().remove().end().text().trim();
      const range = timeBtn.find('.span_time').text().trim();

      if (days.length === 0 || !method || label === "") {
        alert("Please complete your schedule selection.");
        return;
      }

      console.log(days, method, label, range)
      summary(days, method, label, range);


      $('.day-btn').each(function () {
        if (!$(this).hasClass('selected')) {
          $(this).addClass('disabled');
        } else{
          $(this).addClass('active-selector')
        }
      });

      $('.pref-btn').each(function () {
        if (!$(this).hasClass('selected')) {
          $(this).addClass('disabled');
        }else{
          $(this).addClass('active-selector')
        }
      });

      $('.time-btn').each(function () {
        if (!$(this).hasClass('selected')) {
          $(this).addClass('disabled');
        }else{
          $(this).addClass('active-selector')
        }

      });

      $('.day-btn.selected, .pref-btn.selected, .time-btn.selected').removeClass('selected');
      $('#setsched_Btn').prop('disabled', true);
});



$(document).on('click', '.edit-sched-btn', function () {
  const item = $(this).closest('.schedule-item');


  const days = JSON.parse(item.attr('data-days'));
  const method = item.attr('data-method');
  const time = item.attr('data-time').trim();
  const range = item.attr('data-range').trim();


  $('.day-btn, .pref-btn, .time-btn').removeClass('disabled selected');
  days.forEach(day => {
    $(`.day-btn[data-day="${day}"]`).addClass('selected');
  });
  $(`.pref-btn[data-pref="${method}"]`).addClass('selected');

  $('.time-btn').each(function () {
    const btn = $(this);
    const label = btn.clone().children().remove().end().text().trim();
    const spanRange = btn.find('.span_time').text().trim();
    if (label === time && spanRange === range) {
      btn.addClass('selected');
    }
  });


  item.remove();

  $('.sched-summary-list').removeClass('d-none');
  $('#setsched_Btn').prop('disabled', false);
});






               
})



// FUCNTIONS 

function updateSetAvailabilityState() {
  const hasDay = $('.day-btn.selected').length > 0;
  const hasTime = $('.time-btn.selected').length > 0;
  const hasMethod = $('.pref-btn.selected').length > 0;

  $('#setsched_Btn').prop('disabled', !(hasDay && hasTime && hasMethod));
}


function summary(days, method, label, range) {
  const scheduleSummary = `${days.join(', ')} | ${method} at ${label} ${range}`;
  const subject = $('.selected-val').text();
  const topic = $('#topic').val();
  const description = $('#description').val();
  const rate = $('#default-rate').val();

  const coreHTML = `
    <div><strong>Subject:</strong> ${subject}</div>
    <div><strong>Topic:</strong> ${topic}</div>
    <div><strong>Description:</strong> ${description}</div>
    <div><strong>Rate:</strong> ₱ ${rate}</div>
  `;
  $('.sched-core-info').html(coreHTML);

  const scheduleItemHTML = `
    <div class="schedule-item" data-days='${JSON.stringify(days)}' data-method="${method}" data-time="${label}" data-range="${range}">
      ${scheduleSummary}
      <button class="edit-sched-btn" style="margin-left: 10px;">Edit</button>
    </div>
  `;
  $('.sched-schedules').append(scheduleItemHTML);

  console.log("scheduleSummary", scheduleSummary)


  const sched = {
    days: days.length === 1 ? days[0] : days.join(', '),
    method: method,
    label: label,
    range: range
  };
  
  sessionStorage.setItem('sched', JSON.stringify(sched));
  
}