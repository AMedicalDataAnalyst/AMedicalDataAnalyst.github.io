---
layout: post
title: 'Projects vs. Productivity: A Focused Mind is A Happy Mind'
date: 2023-08-15
categories: ["Management", "Time"]
tags: ["How to Do Great Work", "Maker's Schedule, Manager's Schedule", "Time Management"]
math: true
---

I decided to create this (currently fairly basic) tool so that engineers and their managers could have a quick reference to assess how meetings impact productivity. I hope to improve on it with time to capture the subtleties of workplace dynamics. It allows one to visualise the effect of context switching from meetings to technical work.

The tool is also intended to be a guide for engineers to understand how to manage and communicate about their time. I use the word engineer fairly liberaly to mean anyone who is doing the technical work, whereas a manager refers to anyone who is overseeing it.


<html lang='en'>
<head>
  <meta charset='utf-8' />
  <title>Meeting Calendar</title>
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
    // 0. Description of calendar to be shown
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

    // 1. Create the function to populate the calendar
    function populateCalendar() {
      // A. Pre-declare cariables of interest
      const avgNumMeetings = parseInt(document.getElementById("avgNumMeetings").value);
      const avgMeetingDuration = parseInt(document.getElementById("avgMeetingDuration").value)*60000;
      const contextSwitchTime = parseInt(document.getElementById("contextSwitchTime").value)*60000;
      const workingDayStart = 9; // Start time in minutes (9 am)
      const workingDayEnd = 18; // End time in minutes (6 pm)
      currentDate = new Date();
      const minutesPerDay = (workingDayEnd - workingDayStart) * 60 * 60000;
      const totalMinutesAvailable = minutesPerDay * 5;
      const intervalBetweenEvents = Math.round(totalMinutesAvailable / (avgNumMeetings));
      var events = [];
      const dayOfWeek = currentDate.getDay()

      // B. Initialise calendar and first meeting
      // Clear all events from the calendar if any
    calendar.getEventSources().forEach(function(eventSource) {
      eventSource.remove();
    });
      if (dayOfWeek === 0) {
        // If it's Sunday, find the next Monday
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (dayOfWeek > 1) {
        // If it's Tuesday to Saturday, find the previous Monday
        const daysUntilMonday = dayOfWeek - 1;
        currentDate.setDate(currentDate.getDate() - daysUntilMonday);
      }
      currentDate.setHours(9, 0, 0, 0);
      let meetingStartTime = new Date(currentDate);

      // C. Loop over number of meetings to populate calendar
      for (var i = 0; i < avgNumMeetings; i++) {

        // i. Ensure the start time is within working hours and if it is display it with associated context switches
        if (meetingStartTime.getHours() >= 9 && meetingStartTime.getHours() + (avgMeetingDuration / 6000000) <= 18) {
          events.push({
          title: 'Meeting',
          start: new Date(meetingStartTime),
          end: new Date(meetingStartTime.getTime() + avgMeetingDuration),
          description: "",
          backgroundColor: '#e0e0e0', // Blue shade
        });

        // Context switch after meeting
        let latterCSEnd = new Date(meetingStartTime.getTime() + avgMeetingDuration + contextSwitchTime);
        if (meetingStartTime.getHours() > 17 && meetingStartTime.getMinutes() > 45){
          latterCSEnd = new Date(meetingStartTime.getTime()-(meetingStartTime.getMinutes()-45)*60000)
          events.push({
          title: 'Context switch',
          start: new Date(meetingStartTime.getTime() + avgMeetingDuration ),
          end: new Date(meetingStartTime.getTime() + avgMeetingDuration + contextSwitchTime),
          description: "",
          backgroundColor: '#f7be6d', // Orange shade
        });
        } else {
          events.push({
          title: 'Context switch',
          start: new Date(meetingStartTime.getTime() + avgMeetingDuration ),
          end: latterCSEnd,
          description: "",
          backgroundColor: '#f7be6d', // Orange shade
        });
        }

        // Context switch before meeting
        let priorCSStart = new Date(meetingStartTime.getTime()-contextSwitchTime);
        if (meetingStartTime.getHours() >= 9 && meetingStartTime.getMinutes() >= 15) {
          events.push({
          title: 'Context switch',
          start: priorCSStart,
          end: new Date(meetingStartTime.getTime()),
          description: "",
          backgroundColor: '#f7be6d', // Orange shade
        });
        } else if (meetingStartTime.getHours() === 9 && meetingStartTime.getMinutes() > 0) {
          priorCSStart = new Date(meetingStartTime.getTime() - meetingStartTime.getMinutes()*60000);
          events.push({
          title: 'Context switch',
          start: priorCSStart,
          end: new Date(meetingStartTime.getTime()),
          description: "",
          backgroundColor: '#f7be6d', // Orange shade
        });
        }
      } 

    // Update meetingStartTime
    var minutesToAdd = intervalBetweenEvents;
    meetingStartTime = new Date(meetingStartTime.getTime() + minutesToAdd);
    
    // Calculate the day and time for the meeting start
    var meetingDay = meetingStartTime.getDay();
    
    // If the meeting time exceeds the working day end, move to the next day
    if (meetingStartTime.getHours() + (avgMeetingDuration / 6000000) < 9) {
      meetingStartTime.setHours(9, 0, 0, 0)
    }
    if (meetingStartTime.getHours() + (avgMeetingDuration / 6000000) > 18) {
      meetingDay += 1;
      meetingStartTime.setDate(meetingStartTime.getDate() + 1);
      meetingStartTime.setHours(9, 0, 0, 0)
    }
    
  }
  console.log(events)
  calendar.addEventSource(events);
}
            
      document.getElementById('generate-button').addEventListener('click', populateCalendar);
    });
  </script>
</head>
<body>
  <div class="input-box">
    <label for="avgNumMeetings">Average Number of Meetings:</label>
    <input type="number" id="avgNumMeetings" value="5">
  </div>
  
  <div class="input-box">
    <label for="avgMeetingDuration">Average Meeting Duration (in minutes):</label>
    <input type="number" id="avgMeetingDuration" value="50">
  </div>
  
  <div class="input-box">
    <label for="contextSwitchTime">Context Switch Time (in minutes):</label>
    <input type="number" id="contextSwitchTime" value="15">
  </div>
  
  <button id="generate-button">Populate Calendar</button>
  
  <div id='calendar'></div>
</body>
</html>

## Why I built the tool and what I intend to do with it

I wanted to be able to visualise how meetings were affecting my productivity. In the past I've had to work on as many as nine projects at once, each involving itss own meetings and technical work. I went through a pretty rough period of working for far more hours than were stated in my contract, to the detriment of my physical and mental health. I even had a pretty bad accident for which I was told to rest for a month to heal, but by the second week I was using the 'time off' to catch up on work that I was behind on. 

I've since learned to say no.

The problem of employee load management stems from the fact that companies tend to have multiple projects that need doing, and they want to get them all done as quickly as possible. This is understandable, as the relationship between making money and speed at which projects finish is straightforward. If an engineer can finish three equivlent projects instead of two in a given timeframe, they can make 50% more money for themselves or the company they are employed by. That's a significant increase in income. 

However, frequently, having and engineer work multiple projects at once can backfire by leading to a decrease in productivity. Mental health and overwork considerations aside, an engineer constantly switching between projects has to both 'unload' the information of the previous project and 'reload' information for the current one. The process is well-known as context switching, and has been much discussed problem in software engineering. It was brought forth to the general conciousness of the industry more than a decade ago by Paul Graham in his famous [Maker's Schedule, Manager's Schedule](http://paulgraham.com/makersschedule.html) blog post. My aim here is to demonstrate the impact of multiple projects and context switching on productivity, through use of a simple visual tool. 

## Future work

How projects are handled is company dependant, there are many different methodologies employed (waterfall, jira,..). I want to generalise the tool but will have to make some simplifying assumptions for the problem to become tractable. These assumptions are:

1. **Project meetings**: Projects require meetings at regular intervals to discuss progress and next steps
2. **Ad-hoc meetings**: Projects will involve unplanned meetings/discussions, not scheduled in advance, often called to discuss new information
3. **Project management**: Projects will involve some amount of time spent writing emails, updating project plans, and other administrative tasks
4. **Work time**: self explanatory
5. **Context switching**: When an engineer has to switch reference frames 
6. **Team meetings**: The engineer belongs to a team, which has its own meeting agenda (journal clubs, code clubs, ...)
7. **Company meetings**: departmental and all-hands company meetings.
8. The company has a standard working week of 40 hours, and the engineer works 8 hours a day, 5 days a week.

Depending on where you work, it might seem as though the list is exaggerating the problem, or trivializing it. This is why company culture is important, and why it is the focus of questions an experienced engineer will ask when interviewing for a new job.

This list is not exhaustive, but it is enough to demonstrate and to develop a mathematical intuition of the problem, which is what I'd like to write up next. 