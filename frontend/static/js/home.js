
function initHomeScript(){
  const $slide = $('#slide');
  let time = 3500;



  
  function moveNextCard(){
    const $items = $slide.find(".item");
    if($items.length > 0){
      $slide.append($items.first().detach());
  }

}
setInterval(moveNextCard, time);



$(document).on('click', '.join-btn', function() {

  $('.home').removeClass('active-tab').addClass('deactive-tab');
  $('.sign').removeClass('deactive-tab').addClass('active-tab');
  
});

$('.navbar-brand').click(function() {
  console.log("Navbar brand clicked");

  $('.home').removeClass('deactive-tab').addClass('active-tab');
  $('.sign').removeClass('active-tab').addClass('deactive-tab');
});

}

