import { FETCH_EVENTS, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAILURE, SELECT_EVENT } from '../actions/index';

import Immutable from 'seamless-immutable';
import _ from 'lodash/core';

const initialState = Immutable({
    byId: {},
    isFetching: false,
    lastUpdated: undefined
});

//Reducers
export function events (state = initialState, action) {
    switch (action.type) {
        case FETCH_EVENTS:
            return state.merge({ isFetching: true });
        case FETCH_EVENTS_SUCCESS:
            return state.merge({ byId: action.events, lastUpdated: action.lastUpdated, isFetching: false });
        case FETCH_EVENTS_FAILURE:
            return state.merge({ isFetching: false, error: action.error });
        default:
            return state;
    }
};

export function selectedEventId (state = {}, action) {
    switch (action.type) {
        case SELECT_EVENT:
            return action.id;
        default:
            return state;
    }
};

//Selectors
export function getEventsById(state) {
    return state.events.byId;
}

export function getEventIds(state) {
    return _.keys(state.events.byId);
}
