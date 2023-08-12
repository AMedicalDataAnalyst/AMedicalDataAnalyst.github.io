document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: ['dayGrid'],
      defaultView: 'timeGridWeek',
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      minTime: '09:00:00',
      maxTime: '17:30:00',
      weekends: false,
      eventOverlap: false // Prevent events from overlapping
    });
    calendar.render();
  
    function fillCalendar(meetings, duration) {
      const workHours = 8; // Total working hours (9am - 5:30pm)
      const slotDuration = 60; // Time slot duration in minutes
  
      if (meetings * duration > workHours * 60) {
        return "Not enough time to schedule all meetings.";
      }
  
      let slots = [];
      for (let i = 0; i < meetings; i++) {
        const hour = 9 + Math.floor(Math.random() * workHours); // Random hour between 9 and 16
        const minute = 0; // Start meeting on the hour
        slots.push({
          title: `Meeting ${i + 1}`,
          start: moment().day(1).hour(hour).minute(minute).add(i, 'days').toDate(),
          end: moment().day(1).hour(hour).minute(minute).add(i, 'days').add(duration, 'minutes').toDate()
        });
      }
  
      return slots;
    }
  
    function generateCalendar() {
      const numMeetings = parseInt(document.getElementById('meetings').value);
      const duration = parseInt(document.getElementById('duration').value);
      const calendarSlots = fillCalendar(numMeetings, duration);
  
      if (typeof calendarSlots === 'string') {
        alert(calendarSlots);
      } else {
        calendar.addEventSource(calendarSlots);
        alert('Meetings scheduled successfully!');
      }
    }
  });