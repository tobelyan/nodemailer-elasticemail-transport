const axios = require('axios');

class ElasticEmailTransport {
    constructor(options) {
        if (!options || !options.apiKey) {
            throw new Error('ElasticEmailTransport: Missing API key in options');
        }

        this.apiKey = options.apiKey;
        this.apiUrl = options.apiUrl || 'https://api.elasticemail.com/v2/email/send';
    }

    async send(mail, callback) {
        try {
            const emailData = {
                apikey: this.apiKey,
                subject: mail.data.subject,
                from: mail.data.from,
                to: mail.data.to,
                bodyHtml: mail.data.html || undefined,
                bodyText: mail.data.text || undefined,
                isTransactional: mail.data.isTransactional !== undefined ? mail.data.isTransactional : true,
            };

            const response = await axios.post(
                this.apiUrl,
                new URLSearchParams(emailData).toString(),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            callback(null, {
                accepted: [mail.data.to],
                rejected: [],
                response: response.data,
            });
        } catch (error) {
            console.error('Error sending email:', error.response ? error.response.data : error.message);
            callback(error);
        }
    }

}

module.exports = (options) => {
    return {
        name: 'ElasticEmailTransport',
        version: '1.0.1',
        send: (mail, callback) => new ElasticEmailTransport(options).send(mail, callback),
    };
};
