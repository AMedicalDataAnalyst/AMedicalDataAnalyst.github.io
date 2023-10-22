---
layout: post
title: 'Projects vs. Productivity: A Focused Mind is A Happy Mind'
date: 2023-08-15
categories: ["Management", "Time"]
tags: ["How to Do Great Work", "Maker's Schedule, Manager's Schedule", "Time Management"]
math: true
---

I decided to write this blog post so that engineers and their managers could have a reference to point to when their company decides that an additional project needs doing. It is intended to be a guide for both engineers and managers to understand the impact of having multiple projects on the productivity of the person working on them, so that projects are given appropriate resourcing. It is also intended to be a guide for engineers to understand how to manage their time and how to communicate with their managers about their time. I use the word engineer here to mean anyone who is doing the technical work, whereas a manager refers to anyone who is overseeing it.

## The Problem

The problem stems from the fact that companies often have multiple projects that need doing, and they want to get them all done as quickly as possible. This is understandable, as the relationship between making money and speed at which projects finish is fairly straightforward. Think for example of contracting: if an engineer can finish three equivlent projects instead of two in a given timeframe, they can make 50% more money for themselves or the company they are emplyed by. That's a significant increase in income.

However, what I aim to discuss and demonstrate here is that frequently, having and engineer work multiple projects at once can backfire by leading to a decrease in productivity. This is because the engineer is constantly switching between projects, and this switching takes time. This is known as context switching, and it is a well-known problem and much discussed problem in software engineering, brought forth to the general conciousness of the industry more than a decade ago by Paul Graham in his famous [Maker's Schedule, Manager's Schedule](http://paulgraham.com/makersschedule.html) blog post. My aim here is to demonstrate the impact of multiple projects and context switching on productivity, through use of a simple visual tool, examples and some maths. 

## Key assumptions

How projects are handled is company dependant, and there are many different ways to do it. I will make some simplifying assumptions here to make the problem easier to understand and to solve. These assumptions are:

1. Projects require meetings at regular intervals to discuss progress and next steps. These meetings are called project meetings and are often weekly.
2. Projects will involve unplanned meetings/discussions, which I will call ad-hoc meetings. These are meetings that are not scheduled in advance, and are often called to discuss a problem that has arisen.
3. Projects will involve some amount of time spent on project management, which I will call project management time. This is time spent on things like writing emails, updating project plans, and other administrative tasks.
4. Projects will involve some amount of time spent on project work, which I will call project work time. This is time spent on the actual work that needs doing for the project.
5. Projects will involve some amount of time spent on context switching, which I will call context switching time. This is time spent switching between projects, and is the time that is lost when switching between projects.
6. The engineer belongs to a team, which has it's own meetings and ad-hoc meetings. These are called team meetings and team ad-hoc meetings.
7. The company has a standard working week of 40 hours, and the engineer works 8 hours a day, 5 days a week.
8. Finally, the company also has departmental and all-hands company meetings.

This list is not exhaustive, but it is enough to demonstrate the problem and to develop a mathematical intuition of the problem. Depending on where you work, it might seem as though the list is exaggerating the problem, or trivializing it. This is why company culture is important, and why it is the focus of questions an experienced engineer will ask when interviewing for a new job.

## The Visual Tool

<html lang='en'>
<head>
  <meta charset='utf-8' />
  <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
  <style>
    /* Custom styles for the calendar */
    #calendar {
      border: 1px solid #ccc;
      margin: 20px auto;
      max-width: 900px;
      /* Remove title outline */
      font-weight: bold;
      outline: none;
    }
    
    /* Style for input boxes and button */
    .input-box {
      margin: 10px;
    }
    
    #generate-button {
      margin: 10px;
    }
  </style>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById('calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short'
        },
        slotDuration: '00:30:00',
        slotMinTime: '09:00:00',
        slotMaxTime: '18:00:00',
        weekends: false,
        eventOverlap: false,
      });
      
      calendar.render();

      // Function to populate the calendar
      function populateCalendar() {
  var dayCounter = 0; // To keep track of weekdays
  var avgNumMeetings = parseInt(document.getElementById('avgNumMeetings').value);
  var avgMeetingDuration = parseInt(document.getElementById('avgMeetingDuration').value);
  var contextSwitchTime = parseInt(document.getElementById('contextSwitchTime').value);
  var eventSpacing = 15; // Minutes between event starts
  var workingDayStart = 9 * 60; // Start time in minutes (9 am)
  var workingDayEnd = 18 * 60; // End time in minutes (6 pm)
  
  var totalSlotDuration = avgMeetingDuration + contextSwitchTime;
  var minutesPerDay = workingDayEnd - workingDayStart; // Total minutes in the working day
  var totalMinutesAvailable = minutesPerDay * 5; // Total minutes available in the working week
  var intervalBetweenEvents = Math.round(totalMinutesAvailable / avgNumMeetings);
  
  var events = [];
  const dayOfWeek = currentDate.getDay();

  if (dayOfWeek === 0) {
    // If it's Sunday, find the next Monday
    currentDate.setDate(currentDate.getDate() + 1);
  } else if (dayOfWeek > 1) {
    // If it's Tuesday to Saturday, find the previous Monday
    const daysUntilMonday = dayOfWeek - 1;
    currentDate.setDate(currentDate.getDate() - daysUntilMonday);
  }

  // Set the time to 9:00 AM
  currentDate.setHours(9, 0, 0, 0);
  var weekStart = currentDate;
  var meetingStartTime = currentDate;
  for (var i = 0; i <= avgNumMeetings; i++) {
    
    // Ensure the start time is within working hours and if it is display it
    if (meetingStartTime.getHours() >= 9 && meetingStartTime.getHours() + (avgMeetingDuration / 60) <= 18) {
      events.push({
        start: meetingStartTime,
        end: new Date(meetingStartTime.getTime() + avgMeetingDuration * 60),
        backgroundColor: '#e0e0e0', // Blue shade
      });
      if (meetingStartTime.getHours() + (avgMeetingDuration / 60) + (contextSwitchTime / 60) <= 18){
        events.push({
        start: new Date(meetingStartTime.getTime() + avgMeetingDuration * 60),
        end: new Date(meetingStartTime.getTime() + avgMeetingDuration * 60 + contextSwitchTime * 60),
        backgroundColor: '#f7be6d', // Orange shade
      });
      }
    } 

    // Update meetingStartTime
    var minutesToAdd = i * intervalBetweenEvents;
    meetingStartTime.setMinutes(meetingStartTime.getMinutes() + minutesToAdd);
    
    // Calculate the day and time for the meeting start
    var meetingDay = meetingStartTime.getDay();
    var meetingTime = meetingStartTime.getMinutes();
    
    // If the meeting time exceeds the working day end, move to the next day
    if (meetingTime + avgMeetingDuration > workingDayEnd) {
      meetingDay += 1;
      meetingTime = (meetingTime + avgMeetingDuration) - minutesPerDay;
    }
    
    // Set the correct day and time for the meeting start
    meetingStartTime.setDate(meetingStartTime.getDate() + dayCounter + (meetingDay - meetingStartTime.getDay()));
    meetingStartTime.setMinutes(meetingTime);
    
    dayCounter++;
    if (dayCounter === 6) {
      dayCounter = 0;
      weekStart.setDate(weekStart.getDate() + 7);
    }
  }
  
  calendar.addEventSource(events);
}
            
      document.getElementById('generate-button').addEventListener('click', populateCalendar);
    });
  </script>
</head>
<body>
  <div class="input-box">
    <label for="avgNumMeetings">Average Number of Meetings:</label>
    <input type="number" id="avgNumMeetings" value="3">
  </div>
  
  <div class="input-box">
    <label for="avgMeetingDuration">Average Meeting Duration (in minutes):</label>
    <input type="number" id="avgMeetingDuration" value="30">
  </div>
  
  <div class="input-box">
    <label for="contextSwitchTime">Context Switch Time (in minutes):</label>
    <input type="number" id="contextSwitchTime" value="10">
  </div>
  
  <button id="generate-button">Populate Calendar</button>
  
  <div id='calendar'></div>
</body>
</html>
