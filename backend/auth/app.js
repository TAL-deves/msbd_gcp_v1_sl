const { loadExampleData, revokeToken } = require('./model.js');

var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	OAuth2Server = require('oauth2-server'),
	Request = OAuth2Server.Request,
	Response = OAuth2Server.Response;
	
var app = express();

// ***** API docmentation  ***** // 
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
	swaggerDefinition: {
	  info: {
		version: "1.0.0",
		title: "oAuth2.0",
		description: "Auth token process",
		contact: {
		  name: "TAL"
		},
		servers: ["http://localhost:3000"]
	  }
	},
	// ['.routes/*.js']
	apis: ["app.js"]
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// ***** API docmentation  ***** //


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// var mongoUri = 'mongodb+srv://taldb:taldb@testdb.lxlaw.mongodb.net/plaformDB?retryWrites=true&w=majority';
var mongoUri = 'mongodb://localhost:27017/platformDB';

mongoose.connect(mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true
}, function(err, res) {

	if (err) {
		return console.error('Error connecting to "%s":', mongoUri, err);
	}
	console.log('Connected successfully to "%s"', mongoUri);
	loadExampleData()
});

app.oauth = new OAuth2Server({
	model: require('./model.js'),
	accessTokenLifetime: 30 * 60,
	allowBearerTokensInQueryString: true
});


// Routes
/**
 * @swagger
 * /oauth/token:
 *  post:
 *    description: Use  to get an access token
 *    responses:
 *      '200':
 *        description: an object containing access token, expire time, refresh token, expire time
 */

app.post('/oauth/token', obtainToken);

/**
 * @swagger
 * /:
 *  get:
 *    description: login to secret page
 *    responses:
 *      '200':
 *        description: success message from secret page
 */
app.get('/', authenticateRequest, function(req, res) {
	res.send('Congratulations, you are in a secret area!');
});


/**
 * @swagger
 * /logout:
 *  post:
 *    description: logout user
 *    responses:
 *      '200':
 *        description: success message from secret page(under construction!)
 */
app.post('/logout', logoutRequest, (req, res)=>{
	res.json("Thanks!")
});

app.listen(8081);

function logoutRequest(req, res, next) {

	var request = new Request(req);
	// var response = new Response(res);

	var tokenArray = request.headers.authorization.split(" ");
	var token = tokenArray[1];
	var tokenObj = {
		accessToken : token
	}
	return revokeToken(tokenObj, ()=>{
		next();
	})
}

function obtainToken(req, res) {
	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {

			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}
