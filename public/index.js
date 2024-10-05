document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, fetching message...");

  // Fetch the wedding message from the backend
  fetch('/api/wedding-message')
    .then(response => response.json())
    .then(data => {
      // Call the typing effect function with the message
      typeMessage(data.message, document.querySelector('.paper .text'));
    })
    .catch(error => {
      console.error('Error fetching the wedding message:', error);
      document.querySelector('.paper .text').innerText = 'Error loading message.';
    });
});

// Function to display typing effect
function typeMessage(message, element, speed = 100) {
  let index = 0;

  function type() {
    if (index < message.length) {
      element.innerHTML += message.charAt(index); // Add one character at a time
      index++;
      setTimeout(type, speed); // Call type again after a delay
    } else {
      // Once typing is done, show static three dots instead of cursor
      element.classList.add('typing-done'); // Add class to show dots
    }
  }

  type(); // Start the typing effect
}


let dayCount = []

const freedom = document.querySelector('#freedom')

function countdown(dateEnd) {
  var timer, days, hours, minutes, seconds;
  let countdownComplete = false;
  dateEnd = new Date(dateEnd);
  dateEnd = dateEnd.getTime();

  if (isNaN(dateEnd)) {
    return;
  }
  timer = setInterval(function () {
    calculate();   // Call calculate function every second
    // Check if countdown is complete and stop the interval
    if (countdownComplete) {
      clearInterval(timer);   // Stop the interval outside calculate function
    }
  }, 1000);

  function calculate() {
    var dateStart = new Date();
    var dateStart = new Date(dateStart.getUTCFullYear(),
      dateStart.getUTCMonth(),
      dateStart.getUTCDate(),
      dateStart.getUTCHours(),
      dateStart.getUTCMinutes(),
      dateStart.getUTCSeconds());
    var timeRemaining = parseInt((dateEnd - dateStart.getTime()) / 1000)

    if (timeRemaining >= 0) {
      days = parseInt(timeRemaining / 86400);
      timeRemaining = (timeRemaining % 86400);
      hours = parseInt(timeRemaining / 3600);
      timeRemaining = (timeRemaining % 3600);
      minutes = parseInt(timeRemaining / 60);
      timeRemaining = (timeRemaining % 60);
      seconds = parseInt(timeRemaining);




      document.getElementById("days").innerHTML = `${parseInt(days, 10)}<span>Days</span>`;
      document.getElementById("hours").innerHTML =
        `${("0" + hours).slice(-2)}<span>Hours</span>`;
      document.getElementById("minutes").innerHTML = `${("0" + minutes).slice(-2)}<span>Minutes</span>`;
      document.getElementById("seconds").innerHTML = `${("0" + seconds).slice(-2)}<span>Seconds</span>`;


      freedom.innerHTML =
        `<div style = "font-family: 'Handlee', cursive;"><br>To bring you home, <span style="color: #71d1ff; font-family: 'Handlee', cursive;">Saki...</span></div>`

      document.querySelector('.paper').style.display = 'block'


      const boxes = []

      const boxes2 = []
      let counter = 128


      for (let i = 0; i < 128; i++) {

        counter--


        boxes.push(`<div class="box"><p class="day-count">${counter + 1}</p></div>`)




      }

      const bg = document.querySelector('.background')
      bg.innerHTML = boxes.join('')

      const currentBox = document.querySelectorAll(".box");

      let counterB = 128


      for (let i = 0; i < 128 - days; i++) {



        counterB--

        boxes2.push(`<div class="box2"><strong>${counterB + 1}</strong></div>`)


      }



      for (let i = 0; i < 127 - days; i++) {


        currentBox[i].style.visibility = "hidden"

      }



      const whiteBoxes = document.querySelector('.white-boxes')


      whiteBoxes.innerHTML = boxes2.join('')

      const all = document.querySelectorAll('.box2')



      all.forEach((box, i) => {

        if (i == all.length - 1) {

          box.classList.add('lastBox')




          const lastBox = document.querySelector('.lastBox')

          const now = new Date();
          const seconds2 = now.getSeconds();
          const minutes2 = now.getMinutes();
          const hours2 = now.getHours();
          const secondsOfDay = (hours2 * 3600) + (minutes2 * 60) + seconds2;
          lastBox.style.width = `calc(${(100 * secondsOfDay) / 86400}% / 10)`
          lastBox.style.background = "rgb(238,174,202)"
          lastBox.style.color = "transparent"
          lastBox.style.backgroundColor = "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"

          if (days == 0) {


            secondsRemaining = (hours * 60 + minutes) * 60 + seconds


            lastBox.style.width = `calc(${(100 * (secondsOfDay - secondsRemaining)) / secondsOfDay}% / 8)`
          }

        }



      })



    } else if (timeRemaining < 0) {

      countdownComplete = true;

      document.querySelector('.countdown').style.display = 'none';

      const boxes2 = []

      let counter = 128

      for (let i = 0; i < 128; i++) {

        counter--

        boxes2.push(`<div class="box2"><strong>${counter + 1}</strong></div>`)

      }


      const whiteBoxes = document.querySelector('.white-boxes')

      const currentBox = document.querySelectorAll(".box");

      for (let i = 0; i < 128 - days; i++) {


        currentBox[i].style.visibility = "hidden"

      }


      whiteBoxes.innerHTML = boxes2.join('')

      whiteBoxes.style.opacity = "0.3"



      const world = document.querySelector('#world')
      const timer = document.querySelector('.timer')

      timer.style.top = "0"
      timer.style.height = "100vh"

      freedom.innerHTML = `
          <div>
              🎉 The moment has arrived, Saki! 🎉
              <br><br>
              💍 It's time to say <span class="free">Kobul</span> and bring you home... <span class="free">Forever!!!</span> 💕
          </div>`;



      freedom.style.transform = "translate(-0)"
      freedom.style.textAlign = "center"
      freedom.style.letterSpacing = "2px"
      world.style.visibility = "visible"



    }
  }


}





countdown('2/9/2025 04:00:00 PM')

