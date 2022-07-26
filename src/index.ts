import env from "./config/env";
import createApp from "./app";

const app = createApp()
//start server
app.listen(
    env.port,
    () => {
        console.log(`🚀 Server ready at http://localhost:${env.port}`);
        console.log(`🗒 Node Env: ${env.node_env}`)
    }
);


