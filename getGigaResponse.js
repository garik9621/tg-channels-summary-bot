const axios = require("axios");
const {v4: uuidv4} = require('uuid');
const qs = require("qs");
const getToken = async () => {
    const getGigaAccessTokenConfig = {
        method: 'post',
        url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            RqUID: uuidv4(),
            Authorization: `Basic ${process.env.GIGA_AUTH_DATA_KEY}`,
        },
        data: qs.stringify({
            scope: 'GIGACHAT_API_PERS'
        })
    }

    const { data } = await axios(getGigaAccessTokenConfig);

    return data;
}

const requestToGiga = async (accessToken, request) => {
    const gigaRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        data: JSON.stringify({
            model: 'GigaChat',
            messages: [
                {
                    role: 'user',
                    content: request
                }
            ],
            "temperature": 1,
            "top_p": 0.1,
            "n": 1,
            "stream": false,
            "max_tokens": 512,
            "repetition_penalty": 1,
            "update_interval": 0
        })
    }

    const response = await axios(gigaRequestConfig);

    return response;
}

const getGigaResponse = async (request) => {
    const { access_token: accessToken } = await getToken();
    const { data } = await requestToGiga(accessToken, request);

    return data?.choices?.[0]?.message.content || '';
}

module.exports = {
    getGigaResponse
}