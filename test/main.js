document.addEventListener("DOMContentLoaded", () => {
    const slide = document.getElementById('slide');
  
    if (!slide) {
      console.error("❌ #slide not found in the DOM");
      return;
    }
  
    function updateActiveItem() {
      const items = slide.querySelectorAll('.item');
      items.forEach(item => item.classList.remove('active-item'));
  
      if (items[1]) {
        items[1].classList.add('active-item'); // Highlight the "next" card
      }
    }
  
    function moveNextCard() {
      const items = slide.querySelectorAll('.item');
      if (items.length > 0) {
        slide.appendChild(items[0]);
        updateActiveItem();
      }
    }
  
    // Initial activation
    updateActiveItem();
  
    // Auto-play every 2 seconds
    setInterval(moveNextCard, 2000);
  });
  