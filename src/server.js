const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const server = require('fastify')({
  logger: true
});

function App() {
  
    server.register(require('fastify-cors'), { 
        origin: true,
        allowedHeaders: [
            'Origin', 'X-Requested-With', 'Content-Type', 'Accept'
        ]
    })

    server.register(require('./server-routes.js'));

    // Custom Error Handler
    server.setErrorHandler(function (error, request, reply) {
        server.log.error(error);
        reply.send({status:500,message:'Whoops, Something went wrong!'});
    });
  
    server.listen(3001, function (err) {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    });

}

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    App();
}