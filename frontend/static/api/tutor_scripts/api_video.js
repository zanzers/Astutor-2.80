$(document).ready(function () {
    let mediaRecorder;
    let chunks = [];
    let stream = null;
    let timerInterval = null;
    let seconds = 0;
    const $btn = $('#recordBtn');
    const $video = $('#recordVideo');
    const $timer = $('#timer');
    const $msg = $('#videoMsg');
    const $errorBox = $('.video-error');
    const $videoError = $('#videoError'); 

  
    function formatTime(sec) {
      const min = String(Math.floor(sec / 60)).padStart(2, '0');
      const rem = String(sec % 60).padStart(2, '0');
      return `${min}:${rem}`;
    }
  
    function startCountdown(callback) {
      let countdown = 3;
      $msg.text(`${countdown}`).show();
      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          $msg.text(`${countdown}`);
        } else {
          clearInterval(interval);
          $msg.hide();
          callback();
        }
      }, 1000);
    }
  
    function startRecording() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => {
          stream = s;
          chunks = [];
  
          $video.get(0).srcObject = stream;
          $video.prop('muted', true);
          $video.prop('controls', false);
  
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => chunks.push(e.data);
          mediaRecorder.onstop = () => {
            clearInterval(timerInterval);
  
            if (seconds < 2) {
              $errorBox.removeClass('d-none').text('Video must be at least 30 seconds long');
              $video.removeAttr('src');
              $video.get(0).srcObject = null;
              $video.get(0).load();
              $video.prop('controls', false);
              $btn.text('Re-record').data('step', 'restart').prop('disabled', false);
              return;
            }
  
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(blob);
            $video.get(0).srcObject = null;
            $video.attr('src', videoURL).prop('controls', true);
            $video.data('videoBlob', blob); 
            $btn.text('Re-record').data('step', 'restart').prop('disabled', false);
            $errorBox.addClass('d-none').text('');
          };
  
          mediaRecorder.start();
  
          seconds = 0;
          $timer.removeClass('d-none').text('00:00');
          timerInterval = setInterval(() => {
            seconds++;
            $timer.text(formatTime(seconds));
            if (seconds >= 120) {
              $btn.trigger('click');
            }
          }, 1000);
  
          $btn.text('Stop Recording').data('step', 'stop').prop('disabled', false);
        })
        .catch(err => {
          console.error('Camera access denied:', err);
          $btn.prop('disabled', false);
          $msg.text('Camera access denied').show();
        });
    }
  

    $btn.on('click', function () {
      const step = $(this).data('step');
      $btn.prop('disabled', true);
      $msg.hide();
      $errorBox.addClass('d-none');
  
      if (step === 'start') {
        startCountdown(() => {
          startRecording();
        });
  
      } else if (step === 'stop') {
        mediaRecorder.stop();
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          stream = null;
        }
        clearInterval(timerInterval);
        $timer.addClass('d-none');
  
      } else if (step === 'restart') {
        $video.removeAttr('src');
        $video.get(0).srcObject = null;
        $video.get(0).load();
        $video.prop('controls', false);
        $msg.text('Your video will appear here').hide();
        $timer.addClass('d-none').text('00:00');
        $btn.text('Stop Recording').data('step', 'stop');
        startCountdown(() => {
          startRecording();
        });
      }
    });
  

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      $.ajax({
        url: '/api/getting-started/video',  
        type: 'POST',
        data: formData,
        contentType: false, 
        processData: false, 
        beforeSend: function () {
          $btnVideo.prop('disabled', true);
        },

        success: function (response) {
          if (response.success) {
            alert('Video uploaded successfully!');
          } else {
            $videoError.text(response.error).show();
          }
          $btnVideo.prop('disabled', false); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error('Error uploading video:', errorThrown);
          $videoError.text('Error uploading video').show();
          $btnVideo.prop('disabled', false);
        }
      });
    })
     
  
});
  