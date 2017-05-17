import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { normalize } from 'normalizr';
import Immutable from 'seamless-immutable';

import { eventListSchema } from './schema';
import * as reducers from './reducers/reducers';
import App from './components/App.jsx';

const preloadedState = Immutable(window.__PRELOADED_STATE__);

delete window.__PRELOADED_STATE__;

const store = createStore(combineReducers(reducers), preloadedState, composeWithDevTools(
    applyMiddleware(thunk)
));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
