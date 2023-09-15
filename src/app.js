// HTTP Methods
const http = require("http");
const url = require('url');
const PORT = 3000;
const { createLogger, transports, format } = require('winston');


// create the logger
const logger = createLogger({
    level: 'info', // this will log only messages with the level 'info' and above
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'info.log', level: 'info' }),
        new transports.File({ filename: 'error.log', level: 'error' })
    ]
});
const groc = [];
const newItem = {
    name: "milk",
    quantity: 1,
    price: 2.99,
    bought: false,
}
groc.push(newItem);
groc.push(newItem);
const server = http.createServer((req, res) => {

    // GET

    if (req.method === 'GET' && req.url === '/api/data') {

        get(res);
        //POST
    } else if (req.method === 'POST' && req.url === '/api/add') {

        post(req, res);
    }

    else if (req.method === "PUT" && req.url === '/api/edit') {

        put(req, res);
    }

    else if (req.method === "DELETE" && req.url === '/api/remove') {

        deleteItem(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

});

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

function get(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(groc));
    logger.info(" Get " + JSON.stringify(groc));
}
function post(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {

        const item = JSON.parse(body);
        groc.push(item);
        logger.info(" ADD " + JSON.stringify(item));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'item added Successfully!' }));

    });
}
function put(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const index = Number(data.index);

            if (isNaN(index) || index < 1 || index > groc.length) {
                // Invalid index
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Item not found');
                logger.error("Edit ID not found: " + data.index);
            } else {
                const updatedItem = groc[index - 1];
                updatedItem.bought = !updatedItem.bought;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item bought status changed!' }));
                logger.info("Edit: " + JSON.stringify(updatedItem));
            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid request data');
            logger.error("Invalid request data: " + body);
        }
    });
}


function deleteItem(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const index = Number(data.index);

            if (isNaN(index) || index < 1 || index > groc.length) {
                // Invalid index
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Item not found');
                logger.error("DELETE: Invalid index: " + index);
            } else {
                // Remove the item at the specified index
                const deletedItem = groc.splice(index - 1, 1);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item has been deleted!', deletedItem }));
                logger.info("DELETE: " + JSON.stringify(deletedItem));
            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid request data');
            logger.error("DELETE: Invalid request data: " + body);
        }
    });
}


module.exports = server;