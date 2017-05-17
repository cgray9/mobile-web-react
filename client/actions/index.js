import { normalize } from 'normalizr';

import { getActiveGames } from '../api/ticketService'
import { eventListSchema } from '../schema';

export const FETCH_EVENTS = 'events.FETCH_EVENTS';
export const FETCH_EVENTS_SUCCESS = 'events.FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'events.FETCH_EVENTS_FAILURE';
export const SELECT_EVENT = 'events.SELECT_EVENTS';

export const selectEvent = (id) => {
    return {
        type: SELECT_EVENT,
        id: id
    };
};

export const fetchEvents = () => {
    return {
        type: FETCH_EVENTS
    }
};

export const fetchEventsSuccess = (events) => {
    return {
        type: FETCH_EVENTS_SUCCESS,
        events: events,
        lastUpdated: new Date()
    }
};

export const fetchEventsFailure = (error) => {
    return {
        type: FETCH_EVENTS_FAILURE,
        error: error
    }
};

export const requestEvents = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(fetchEvents());
            const activeGamesResponse = await getActiveGames();
            const normalizedResponse = normalize(activeGamesResponse, eventListSchema);
            dispatch(fetchEventsSuccess(normalizedResponse.entities.events));
        } catch(error) {
            dispatch(fetchEventsFailure(error));
        }
    }
}
