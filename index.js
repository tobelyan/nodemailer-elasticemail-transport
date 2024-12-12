const axios = require('axios');

class ElasticEmailTransport {
    constructor(options) {
        if (!options || !options.apiKey) {
            throw new Error('ElasticEmailTransport: Missing API key in options');
        }

        this.apiKey = options.apiKey;
        this.apiUrl = options.apiUrl || 'https://api.elasticemail.com/v2/email/send';
    }

    send(mail, callback) {
        const emailData = {
            apikey: this.apiKey,
            subject: mail.data.subject,
            from: mail.data.from,
            to: mail.data.to,
            bodyHtml: mail.data.html || undefined,
            bodyText: mail.data.text || undefined,
            isTransactional: mail.data.isTransactional !== undefined ? mail.data.isTransactional : true,
        };

        axios
            .post(this.apiUrl, null, { params: emailData })
            .then((response) => {
                callback(null, {
                    accepted: [mail.data.to],
                    rejected: [],
                    response: response.data,
                });
            })
            .catch((error) => {
                callback(error);
            });
    }
}

module.exports = (options) => {
    return {
        name: 'ElasticEmailTransport',
        version: '1.0.0',
        send: (mail, callback) => new ElasticEmailTransport(options).send(mail, callback),
    };
};
