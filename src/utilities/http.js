export const callPublicApis = async (config) => {
    let queryURL = config.url;
    let requestParams = config.requestParams;
    let queryString = '';
    for (const paramKey in requestParams) {
        if (queryString.length === 0) {
            queryString = '?' + paramKey + '=' + requestParams[paramKey]
        } else {
            queryString = queryString + '&' + paramKey + '=' + requestParams[paramKey]
        }
    }

    const response = fetch(queryURL + queryString, {
        method: 'GET',
            headers: {
                Accept: 'application/json'
            }
    })

    return response;
}