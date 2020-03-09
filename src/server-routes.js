async function defaultRoute (server, options) {
    server.get('/', async (request, reply) => {
        reply.code(404);
        await reply.send({ message: 'are you lost?' });
    });

    server.post('/api/webhook', async (request, reply) => {
        reply.code(200);
        if(request.body.text === 'hi') {
            reply.send([{
                "text": "this is an automated message!\n=============\n\nHello, what's up bro!",
                "type": "message"
            }]);
        } else {
            reply.send('');
        }
        await reply;
    });
}
  
module.exports = defaultRoute;