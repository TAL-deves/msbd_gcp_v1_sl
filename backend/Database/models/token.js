var mongoose = require('mongoose'),
	modelName = 'token',
	schemaDefinition = require('../schema/' + modelName),
	schemaInstance = mongoose.Schema(schemaDefinition);

schemaInstance.index({ "refreshTokenExpiresAt": 1 }, { expireAfterSeconds: 30 });

var modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;
