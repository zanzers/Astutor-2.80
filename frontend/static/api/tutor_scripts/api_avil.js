$(document).ready(function(){
    const selectedDays = new Set();
    let selectedTime = '';
    let availabilityList = [];
    
    const dayButtons = document.querySelectorAll('.day-btn');
    const timeButtons = document.querySelectorAll('.time-btn');
    const setBtn = document.getElementById('setAvailabilityBtn');
    const summaryList = document.getElementById('availabilitySummary');
    
    // Handle day selection
    dayButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
    
        const day = btn.dataset.day;
        btn.classList.toggle('active');
    
        if (selectedDays.has(day)) {
          selectedDays.delete(day);
        } else {
          selectedDays.add(day);
        }
    
        document.querySelector('.time-selector').classList.toggle('d-none', selectedDays.size === 0);
        updateSelectedDayLabel();
      });
    });
    
    // Handle time selection
    timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        timeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTime = btn.dataset.time;
      });
    });
    
    // Handle "Set Availability"
    setBtn.addEventListener('click', () => {
      if (!selectedDays.size || !selectedTime) return;
    
      const days = Array.from(selectedDays);
      const label = timeLabel(selectedTime);
      const entry = { days, time: selectedTime };
    
      availabilityList.push(entry);
      addToSummaryList(entry);
    
      // Disable selected days
      days.forEach(day => {
        const btn = document.querySelector(`.day-btn[data-day="${day}"]`);
        btn.disabled = true;
        btn.classList.remove('active');
      });
    
      resetSelection();
    });
    
    // Add entry to list
    function addToSummaryList(entry, index = availabilityList.length - 1) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
    
      const text = `${entry.days.join(', ')} — ${timeLabel(entry.time)}`;
      li.innerHTML = `
        <span>${text}</span>
        <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
      `;
    
      li.querySelector('.edit-btn').addEventListener('click', () => editEntry(index));
      summaryList.appendChild(li);
    }
    
    // Edit availability
    function editEntry(index) {
      const entry = availabilityList[index];
    
      // Remove it visually and logically
      summaryList.innerHTML = '';
      availabilityList.splice(index, 1);
    
      // Re-enable selected days
      entry.days.forEach(day => {
        const btn = document.querySelector(`.day-btn[data-day="${day}"]`);
        btn.disabled = false;
        btn.classList.add('active');
        selectedDays.add(day);
      });
    
      selectedTime = entry.time;
      timeButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.time === selectedTime);
      });
    
      // Re-render remaining
      availabilityList.forEach(addToSummaryList);
      document.querySelector('.time-selector').classList.remove('d-none');
      updateSelectedDayLabel();
    }
    

    function resetSelection() {
      selectedDays.clear();
      selectedTime = '';
      timeButtons.forEach(btn => btn.classList.remove('selected'));
      document.querySelector('.time-selector').classList.add('d-none');
      updateSelectedDayLabel();
    }
    
    // Helper
    function updateSelectedDayLabel() {
      document.getElementById('selectedDay').textContent = Array.from(selectedDays).join(', ') || '';
    }
    
    function timeLabel(key) {
      return {
        morning: '6AM–12PM',
        afternoon: '12PM–6PM',
        evening: '6PM–10PM'
      }[key] || '';
    }
    
    
})