import env from "./config/env";
import createApp from "./app";

const app = createApp()
//start server
const server = app.listen(
    env.port,
    () => {
        console.log(`🚀 Server ready at http://localhost:${env.port}`);
        console.log(`🗒 Node Env: ${env.node_env}`)
    }
);

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close((er: Error | undefined) => {
        console.log('HTTP server closed. Error:', er);
    })
})


