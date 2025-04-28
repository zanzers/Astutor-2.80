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


        
              
})


$(document).on('click', '.selector-menu_biz', function(){

  const selectedText = $(this).text().trim();
  console.log("Selected", selectedText);

  const subjectContainer = $(this).closest('.subject-selected');
  subjectContainer.find('.selected-val').text(selectedText);
  subjectContainer.find('.selector-menu').addClass('d-none');
})





$(document).on('click', '.edit-about', function(e) {
  e.stopPropagation();
  const editMenu = $(this).siblings('.edit-menu');
  $('.edit-menu').not(editMenu).hide(); 
  editMenu.toggle();
});


$(document).on('click', function() {
  $('.edit-menu').hide();
});


$(document).on('click', '.edit-option', function() {
  const aboutWrapper = $(this).closest('.about-details_wrp');
  const aboutContent = aboutWrapper.find('.about-content p');

  if (aboutContent.hasClass('about-placeholder')) {
    aboutContent.text('');
  }

  aboutContent.attr('contenteditable', 'true').focus();

  if (!aboutWrapper.find('#save-about').length) {
    aboutWrapper.append(`
      <div class="save-about-container">
        <button id="save-about" class="save-button">Save</button>
      </div>
    `);
  }


  aboutWrapper.find('.about-count-tip').show();
  updateCharacterCount(aboutWrapper);

  $(this).parent('.edit-menu').hide();
});


$(document).on('click', '#save-about', function() {
  const aboutWrapper = $(this).closest('.about-details_wrp');
  const aboutContent = aboutWrapper.find('.about-content p');
  const newText = aboutContent.text().trim();

  aboutContent.removeAttr('contenteditable');

  if (newText === '') {
    aboutContent.html('Share more about yourself! Mention your experience, teaching style, and what makes your lessons special to attract future students.');
    aboutContent.addClass('about-placeholder');
  } else {
    aboutContent.addClass('about-placeholder');
  }

  aboutWrapper.find('.save-about-container').remove();
  aboutWrapper.find('.editing-text').remove();


  aboutWrapper.find('.about-count-tip').hide();
});


$(document).on('input', '.about-content p[contenteditable="true"]', function() {
  const maxLength = 200;
  let text = $(this).text();

  if (text.length > maxLength) {
    $(this).text(text.substring(0, maxLength));
    placeCaretAtEnd(this);
  }

  const aboutWrapper = $(this).closest('.about-details_wrp');
  updateCharacterCount(aboutWrapper);
});


function updateCharacterCount(wrapper) {
  const text = wrapper.find('.about-content p').text().trim();
  const currentLength = text.length;
  const countTip = wrapper.find('.about-count-tip');

  countTip.text(`${currentLength}/200`);

  if (currentLength >= 200) {
    countTip.addClass('limit-reached');
  } else {
    countTip.removeClass('limit-reached');
  }
}



function placeCaretAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}


$(document).on('click', '.account-switch-tab_tag', function() {
  const clickedTab = $(this);
  const tabText = clickedTab.find('.account-switch-tab_label span').text().trim().toLowerCase();

  $('.switch-tab_line').remove();
  clickedTab.append('<span class="switch-tab_line"></span>');


  $('.about-data, .lesson-data, .schedule-data, .chat-data, .notification-data').hide();

  if (tabText === 'about') {
    $('.about-data').show();
  } else if (tabText === 'lessons') {
    $('.lesson-data').show();
  } else if (tabText === 'schedule') {
    $('.schedule-data').show();
  } else if (tabText === 'chat') {
    $('.chat-data').show();
  } else if (tabText === 'notification') {
    $('.notification-data').show();
  }
});


$(document).ready(function() {

  $('.sched-val').click(function() {
    $('.shed-menu').toggleClass('d-none'); 
  });

  
  $('.shed-menu').on('click', '.shed-menu_biz', function() {
    console.log("Schedule item clicked"); 
    var selectedSchedule = $(this).text();

    console.log("Selected Schedule:", selectedSchedule);


    $('.sched-val').text(selectedSchedule);


    $('.shed-menu').addClass('d-none');
  });
});


