import React, {Component} from 'react';

// function Error(props) {
// 	return (
// 	  <div>
// 	  <iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=lbd.co.il_sdm6nc85d7akf5ugu4m66lkf3o%40group.calendar.google.com&amp;color=%23691426&amp;ctz=Asia%2FJerusalem" style={{border: "0", width:"100%", height:"70vh", frameborder:"0", scrolling:"no"}} scrolling="no"></iframe>
// 	  Error</div>
// 	) }

// export default Error;

import Calendar from 'react_google_calendar'

const calendar_configuration = {
api_key: 'AIzaSyD0p_BsfUSH0BXylH_CiTGSiPhHQmHC7Dc',
    calendars: [
      {
        name: 'demo', // whatever you want to name it
        url: 'lbd.co.il_sdm6nc85d7akf5ugu4m66lkf3o%40group.calendar.google.com' // your calendar URL
      }
    ],
    dailyRecurrence: 700,
    weeklyRecurrence: 500,
    monthlyRecurrence: 20
}

export default class Error extends Component {
    constructor(props) {
      super(props)
        this.state = {
          events: []
        }
    }

    render = () =>
      <div dir="ltr">
        <Calendar
          events={this.state.events}
          config={calendar_configuration} />
      </div>
}