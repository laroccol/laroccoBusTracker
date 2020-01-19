/**
 * Lucas LaRocco
 */

class BusTrackerServer {
    // Note:
    // The constructor is called when the 'new' statement
    // (at bottom of file) is executed.
    constructor() {
        // do nothing in this case (never runs since ExpressDemo is not initialized)
    }

    // This function can have any name you choose.
    static serve() {

        const express = require('express'); // from NPM: express web server framework
        // for docs on express, see https://expressjs.com/en/api.html

        const favicon = require('express-favicon'); //from NPM: for automatic handling of favicon request

        const app = express(); // init the framework

        let mongoose = require('mongoose'); // From NPM: MongoDB API for NodeJS

        // ****** NOTE THIS WILL FAIL IF MONGOD.EXE IS NOT RUNNING or the db does not exist. ******
        let connection = mongoose.connect('mongodb://localhost/bustracker', {useNewUrlParser: true});

        // A schema describes the format/structure of the documents in a collection
        let busSchema = new mongoose.Schema(
            {
                'rt': String,
                'vid': String,
                'spd': String,
                'tmstmp': String,
                'lat': String,
                'lon': String
            }
        );

        // This creates the "contacts" collection and associates it with the above schema.
        // Note: Whatever name you use for the collection, mongo pluralizes it automatically.
        let busmodel = mongoose.model('Bus', busSchema);

        let server = app.listen(3000, function () { // start the server
            let host = server.address().address;
            let port = server.address().port;
            console.log('Express server running from host ' + host + ' on port ' + port);
        });

        // // Tell express-favicon where to find the icon file
        app.use(favicon(__dirname + '/webcontent/favicon.ico'));


        // // Route for any static file within the webcontent folder
        app.use(express.static(__dirname +'/webcontent') ); // the folder to use to get static files (e.g. index.html)

        // Use this to allow Ajax requests to be honored from any origin
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            next();
        });

        app.get('/', function(req, res){
            res.sendFile('BusTrackerMQ.html', { root: __dirname + "/webcontent" } );
        });

        // Route for the url localhost:3000/BusInfo
        app.get('/BusSpeed', function(request, response) {
            let url = require('url');
            let urlObject = url.parse(request.url, true);
            let speed = '';
            if (urlObject.query['spd']) {
                speed = urlObject.query['spd'];
            }

            busmodel.find({'spd': {$gte: speed}}, function(err, records) {
                if (err !== null) {
                    console.error(err); // log an error if one occurs
                } else {
                    // NOTE that records is a Javascript object
                    //console.info(JSON.stringify(records));
                    response.json(records);
                }
                //               mongoose.disconnect(); // do this when you don't need to use the db anymore
            });

        });

        // Route for the url localhost:3000/BusInfo
        app.get('/BusInfo', function( request, response ) {
            let ajax = require('request'); // import the request library (downloaded from NPM) for making ajax requests
            let url = require('url');  // used for parsing request urls (in order to get params)
            let urlObject = url.parse(request.url,true); // see https://nodejs.org/api/url.html
            let route = '';
            if( urlObject.query["rt"] ) { // check for the existence of a specific parameter
                route = urlObject.query["rt"];
            }
            let key = ''; // default key. Get the real one (yours) from the 'key=XXXXX' request param
            if( urlObject.query["key"] ) { // check for the existence of a specific parameter
                key = urlObject.query["key"];
            }

            if (route === '1003') {
                key = 'dfj02fj2';
            }
            let uri = "http://realtime.ridemcts.com/bustime/api/v2/getvehicles?key="+ key + "&rt=" + route + "&format=json";

            // the default JSON response (same as asking for route 1000)
            let busData = {"status":"Server Error; IOException during request to ridemcts.com: Simulated server error during request to ridemcts.com"}; // the default JSON response

            if( route === '1000') { // simulate MCTS server error...
                response.json(busData); // note that this sends the above default JSON response
                return;
            } else if( route === '1001' ) { // for routes 1001, 1002, 1003,  simulate error conditions and generate appropriate JSON/HTTP responses (like sapphire does)
                response.writeHead(404, {"Content-Type": "text/html"});
                response.end();
                return;
            } else if( route === '1002' || route === '' || key === '') {
                busData = {"status":"Key or route parameter empty"};
                response.json(busData);
                return;
            }

            // if no "bad" routes are detected above, make the real ajax call to MCTS
            ajax(uri, function( error, res, body ) {
                if( !error && res.statusCode === 200 ) { // no errors and a good response
                    // parse the body (a JSON string) to a JavaScript object
                    busData = JSON.parse(body);
                }
                // Note: if a failure occurs, the default response above should be sent here
                response.json(busData); // no need to set content-type! Express handles it automatically
            });
        });
    } // end serve() method
} // end ExpressDemo class

BusTrackerServer.serve(); // alternate when using static run() method