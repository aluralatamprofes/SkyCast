// app.js
import jsonServer from 'json-server';

const server = jsonServer.create();
server.use( jsonServer.defaults() );
server.use( jsonServer.router( 'db.json' ) );

server.listen( 3000, () => {
    console.log( 'JSON Server is running' );
} );
