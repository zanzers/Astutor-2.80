
  $(document).ready(function () {
    const $container = $('#coinContainer');
    const maxCoins = 14;
    const minCoins = 1;

    function syncCoins(budget) {
      const desiredCoins = Math.min(Math.max(budget / 500, minCoins), maxCoins); // Ensure between 1 and 12
      const currentCoins = $container.children().length;

      $('#budgetValue').text(budget);

      if (desiredCoins > currentCoins) {
        // ADD coins
        for (let i = currentCoins; i < desiredCoins; i++) {
          const randomLeft = Math.random() * 120; 
          const randomBottom = Math.random() * 80; 
          const $coin = $("<i class='bx bxs-coin'></i>").css({
            bottom: `${randomBottom}px`,
            left: `${randomLeft}%`,
            zIndex: i,
            position: 'absolute'
          }).addClass('coin-drop');
          $container.append($coin);
        }
      } else if (desiredCoins < currentCoins) {
        // REMOVE coins
        for (let i = currentCoins; i > desiredCoins; i--) {
          $container.children().last().remove();
        }
      }
    }

    $('#budgetRange').on('input', function () {
      const budget = parseInt($(this).val());
      syncCoins(budget);
    });

    syncCoins(parseInt($('#budgetRange').val()));
  });

