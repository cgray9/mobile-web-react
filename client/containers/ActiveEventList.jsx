import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import { requestEvents, selectEvent } from '../actions';
import { getEventsById, getEventIds } from '../reducers/eventReducers';
import EventList from '../components/EventList';

class ActiveEventList extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.props.dispatch(requestEvents());
    }

    render() {
        return(
            <EventList
                onEventClick={this.onEventClick}
                eventsById={this.props.eventsById}
                eventIds={this.props.eventIds}
            />
        )
    }

    onEventClick(id) {
        return this.props.dispatch(selectEvent(id))
    }
}

ActiveEventList.fetchData = ({ store }) => { return store.dispatch(requestEvents()) };

const mapStateToProps = (state) => {
    return {
        eventsById: getEventsById(state),
        eventIds: getEventIds(state)
    };
};

export default connect(mapStateToProps)(ActiveEventList);
