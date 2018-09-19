#RouteSmith
RouteSmith is a simple routing solution for Express-based apps. RouteSmith-Sequelize is package that simplifies the creation of controllers to perform CRUD operations on Sequelize models.

##Installation
```bash
$ npm install --save routesmith-sequelize
```

##Usage
```bash
const express = require('express');
const router = express.Router();
const usersData = require('./usersData'); // Require your own data file or add your own object here.
const routes = [
	{
		path:'users',
		id:'userID',
		controller:require('routesmith-sequelize')(usersData), // Initialize RouteSmith-Sequelize with the route data.
		middleware:[]
	}
];

const rs = require('routesmith');
router.use('/', rs.Initialize(routes)); // Feed the list of routes into RouteSmith.
```
RouteSmith-Sequelize creates a default controller for a given model based off of the data contained in a JavaScript object. The controller can then be plugged in to a RouteSmith route list to easily add CRUD endpoints to the model.

##Data
```bash
module.exports = {
	id:'userID',
	belongsTo:'', // Optional
	model:{},
	required:[
		'name',
		'email',
		'password'
	],
	optional:[
		'description',
		'phone',
		'address'
	],
	public:[
		'name',
		'description',
		'email',
		'phone',
		'address'
	],
	req:[
		{
			name:'organizationID',
			hierarchy:[
				'org',
				'id'
			]
		}
	]
};
```
RouteSmith controllers require several pieces of information, as seen in this example data file.

###id
The `id` field determines what label should be used for parameters in the route's URL. Typically, this must match the id of the route created by RouteSmith, as shown in the usage example.

###belongsTo
The `belongsTo` field is optional, and can only be used if the controller is for a child route. If it is present, it controls which URL parameter is used for a foreign key on the model. For example, if a controller is created for forum posts and every post has an author column as a foreign key for the user table, `belongsTo` could be set to the column's name (`userID`, for instance) if the request URL is `/users/:userID/posts`.

###Model
The `model` field allows you to define which Sequelize model will be used.

###Required Fields
The `required` array dictates what values are required in the body of the request during POST and PUT operations. If any of these values are missing from the body of the request, an error will be returned by the controller.

###Optional Fields
The `optional` array dictates what values are optional in the body of the request during POST and PUT operations. If they are present, the table will be modified accordingly. If they are absent, no errors will be returned.

###Public Fields
The `public` array dictates what values are publicly visible in the response of a GET request.

###Request Data
The `req` array allows developers to define values to look for in the request object, typically added by middleware prior to the route being reached. For example, a global middleware function might retrieve user data and attach it to the request object for future use. The `req` array can then define a new name for the object and the hierarchy through the request object that is needed to retrieve the proper value (for nested values - i.e. `req.user.id`).
