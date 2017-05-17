import path from 'path';
import koa from 'koa';
import request from 'koa-request';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';
import React from 'react';
import ReactDomServer from 'react-dom/server'
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from './client/reducers/reducers'
// import { getActiveGames } from './api/ticketService'
import App from './client/components/App';
import ActiveEventList from './client/containers/ActiveEventList';

const app = new koa();
const router = new koaRouter();
const port = 3000;
const hostname = 'localhost';

// Serve static files
app.use(mount('/dist', serve('dist')))

router.get('/', renderApp);

app.use(router.routes());

async function renderApp(ctx) {

    // Create a new Redux store instance
    const store = createStore(combineReducers(reducers), {}, applyMiddleware(thunk));

    await ActiveEventList.fetchData({ store });

    const html = ReactDomServer.renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );

    const finalState = store.getState();
    // ctx.type = "text/html";
    const renderedBody = renderIndex(html, finalState);
    ctx.body = renderedBody;
}

function renderIndex(html, preloadedState) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Mobile Web React </title>
        </head>
        <body>
            <div id="root">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script type="application/javascript" src="/dist/index_bundle.js"></script>
        </body>
    </html>`;
}

app.listen(port, () => {
    console.info(`==> ✅  Server is listening on port ${port}`);
    console.info(`==> 🌎  Go to http://${hostname}:${port}`);
});
