const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-east-1' }); // Assicurati di specificare la regione corretta

const topicArn = 'arn:aws:sns:us-east-1:869141024194:om'; // Sostituisci con il tuo ARN del topic SNS

const sendSnsMessage = (message) => {
    const params = {
        Message: JSON.stringify(message),
        TopicArn: topicArn,
    };

    return sns.publish(params).promise();
};

// Funzione per gestire la richiesta HTTP
const http = require('http');

http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const message = JSON.parse(body);
            try {
                const result = await sendSnsMessage(message);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Message sent', result }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Failed to send message', error }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
}).listen(3000, () => {
    console.log('Server is listening on port 3000');
});
