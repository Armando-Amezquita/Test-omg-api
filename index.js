const server = require('./src/app');
const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Conected to ${port}`)
});