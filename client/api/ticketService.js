import _ from 'lodash/core';
import fetch from 'isomorphic-fetch';

const API_KEY = process.env.TICKET_SERVICE_API_KEY || 'ENTER DEFAULT API KEY HERE';

const isExpectedStatusCode = (statusCode) => statusCode === 200 || statusCode === 401;
const responseParser = (body, response) => {
    const { statusCode } = response;
    if (isExpectedStatusCode(statusCode)) {
        return body;
    } else {
        const statusCode = response.statusCode || 500;
        return new Error(`Request Error: ${statusCode} - ${path} - ${body}`);
    }
};

const makeServiceCall = (path, headers = {}, options = {}) => {
    const baseUrl = 'http://localhost:8082/ticket-service/v2/';
    const requestOptions = _.extend({
        url: `${baseUrl}${path}`,
        headers: _.extend({
            "X-EXP-API-KEY": API_KEY
        }, headers),
    }, options);

    return fetch(`${baseUrl}${path}`, requestOptions)
        .then(function(response) {
            if (response.ok) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => response.json());
};

const getGames = (endpoint, options = {}, headers = {}) => {
    const query = {
        groupShortNames: options.teamsToFilter || [],
        maxGames: options.maxReturnedGames,
        fromDate: options.fromDate || null,
        toDate: options.toDate || null,
        externalEventId: options.externalEventId || null,
        ticketSystem: options.ticketSystem || null,
        passProgramId: options.passProgramId || null
    };

    return makeServiceCall(endpoint, headers, {
        method: "POST",
        form: query
    })
    .then(json => json)
    .catch(error => []);
};

const getCategories = async function (games = []) {
    const gameIds = games.map(game => game.id),
        endpoint = "category/activeGamesCategoriesInfo",
        params = `?gameIds[]=${gameIds.join("&gameIds[]=")}`;

    return makeServiceCall(`${endpoint}${params}`)
        .then(json => json)
        .catch(error => []);
};

const attachCategoriesToGames = async function (games = []) {
    if (games.length) {
        const categoryResponse = await getCategories(games);

        games.forEach((game) => {
            const gameId = game.id,
                gameCategoryResponse = categoryResponse[gameId];

            game.categories = gameCategoryResponse.categories;
            game.categoryGroups = gameCategoryResponse.gameCategories;
        });
    }

    return games;
};

export async function getActiveGames(options = {}) {
    const games = await getGames("game/activeGamesInfo", options);
    return await attachCategoriesToGames(games);
}
