import React from 'react';
import Event from './Event';

class EventList extends React.Component {
    render() {
        const events = this.props.eventIds.map(eventId => {
            const event = this.props.eventsById[eventId]
            return <Event key={event.id} text={event.name} onClick={() => this.props.onEventClick(eventId)} />
        });
        return (<ul>{events}</ul>);
    }
};

export default EventList;
