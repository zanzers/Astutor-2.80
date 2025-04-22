$(document).ready(function () {
    const selectedDays = new Set();
    let selectedTime = '';
    let availabilityList = [];
    let selectedPref = '';
  
    const dayButtons = document.querySelectorAll('.day-btn');
    const timeButtons = document.querySelectorAll('.time-btn');
    const setBtn = document.getElementById('setAvailabilityBtn');
    const summaryList = document.getElementById('availabilitySummary');
    const summaryContainer = document.querySelector('.confirm_schedule');
    const messageBox = document.querySelector('.avail-message');
  


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
  
        updateSelectedDayLabel();
      });
    });
  
    timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        timeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTime = btn.dataset.time;
      });
    });
  

    document.querySelectorAll('.pref-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pref-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedPref = btn.dataset.pref;
      });
    });
  
    setBtn.addEventListener('click', () => {
      if (!selectedDays.size || !selectedTime || !selectedPref) return;
  
      const days = Array.from(selectedDays);
  
      const entry = {
        days,
        time: selectedTime,
        pref: selectedPref
      };
  
      availabilityList.push(entry);
      addToSummaryList(entry);
  
      days.forEach(day => {
        const btn = document.querySelector(`.day-btn[data-day="${day}"]`);
        btn.disabled = true;
        btn.classList.remove('active');
      });
  
      resetSelection();
    });
  
    function addToSummaryList(entry, index = availabilityList.length - 1) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
  
      const text = `Day: ${entry.days.join(', ')},  <br>
      Time: ${timeLabel(entry.time)} <br>
      Method: ${preferLabel(entry.pref)}`; 
  
      li.innerHTML = `
        <span>${text}</span>
        <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
      `;
  
      li.querySelector('.edit-btn').addEventListener('click', () => editEntry(index));
      summaryList.appendChild(li);
      summaryContainer.classList.remove('d-none');
      messageBox.textContent = ''; 

    }
  
    function editEntry(index) {
      const entry = availabilityList[index];
      summaryList.innerHTML = '';
      availabilityList.splice(index, 1);
  
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
  

      selectedPref = entry.pref;
      document.querySelectorAll('.pref-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.pref === selectedPref);
      });
  
      availabilityList.forEach(addToSummaryList);
      document.querySelector('.time-selector').classList.remove('d-none');
      updateSelectedDayLabel();
    }
  
    function resetSelection() {
      selectedDays.clear();
      selectedTime = '';
      selectedPref = ''; // ✅ ADDED: Reset preference
      timeButtons.forEach(btn => btn.classList.remove('selected'));
      document.querySelectorAll('.pref-btn').forEach(btn => btn.classList.remove('selected')); // ✅ ADDED
      updateSelectedDayLabel();
  
      const allDisabled = [...dayButtons].every(btn => btn.disabled);
      if (allDisabled) {
        document.querySelector('.time-selector').classList.add('d-none');
      }
    }
  
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
  
    function preferLabel(key) {
      return {
        online: 'Online',
        InPerson: 'In Person'
      }[key] || '';
    }




    $('.btn-avail').on('click', function (e) {
        e.preventDefault();
        
        console.log("submit")

        const tutorID= sessionStorage.getItem("tutorID");
        if (!availabilityList.length) {
            messageBox.textContent = "Please add at least one availability entry before continuing.";
            return;
          }
      

      let avail_form = {
            tutorID: tutorID,
            availability: availabilityList
          };

          console.log(avail_form);

        // NOTE: save this in the db tutor Id, Day, Time, Method see the website...
        // user can enter multiple array of availability  
        // return should be console.log('response.message:', Save);

        
        // $.ajax({
        //   url: '',
        //   type: 'POST',
        //   contentType: 'application/json',
        //   ata: JSON.stringify(avail_form),
        //   success: function (response) {
        //     console.log('Server response:', response);
     
        //   },
        //   error: function (xhr, status, error) {
        //     console.error('Error:', error);
        //   }
        // });
      });
      
  });
  