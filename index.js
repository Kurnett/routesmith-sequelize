
module.exports = function (data) {
	let controller = {};
	
	controller.data = data;
	console.log(data);

	controller.create = (req,res) => {
		if (controller.data) {
			var attributes = {};

			controller.data.required.forEach((attribute) => {
				if (attribute in req.body) {
					attributes[attribute] = req.body[attribute];
				} else {
					return controller.error(res, 'Missing parameters.');
				}
			});

			if (controller.data.optional) {
				controller.data.optional.forEach((attribute) => {
					if (attribute in req.body) {
						attributes[attribute] = req.body[attribute];
					}
				});
			}
			
			if (controller.data.req) {
				controller.data.req.forEach((attribute) => {
					let val = req;
					for (let i = 0; i < attribute.hierarchy.length; i++) {
						val = val[attribute.hierarchy[i]];
					}
					attributes[attribute.name] = val;
				});
			}

			controller.data.model.create(attributes).then(function (entity) {
				controller.success(res, entity);
			});
		} else {
			controller.error(res, 'Route data undefined.');
		}
	};

	controller.getAll = (req,res) => {
		if (controller.data) {
			if (controller.data.belongsTo) {
				console.log("BELONGS TO");
				console.log(req.params[controller.data.belongsTo]);
			}
			controller.data.model.findAll().then(function (data) {
				if (data.length > 0) {
					console.log(data[0].dataValues);
					let mappedData = data.map((val) => {
						let entity = {};
						controller.data.public.forEach((attribute) => {
							if (attribute in val) {
								entity[attribute] = val[attribute];
							}
						});
						return entity;
					});
					controller.success(res, mappedData);
				} else {
					controller.success(res, []);
				}
			});
		} else {
			controller.error(res, 'Route data undefined.');
		}
	};

	controller.get = (req,res) => {
		if (controller.data) {
			controller.data.model.findById(req.params[data.id]).then(function (data) {
				if (data) {
					let entity = {};
					controller.data.public.forEach((attribute) => {
						if (attribute in data.dataValues) {
							entity[attribute] = data.dataValues[attribute];
						}
					});
					controller.success(res, entity);
				} else {
					controller.error(res, 'Entity not found.');
				}
			});
		} else {
			controller.error(res, 'Route data undefined.');
		}
	};

	controller.update = (req,res) => {
		if (controller.data) {
			controller.data.model.findById(req.params[data.id]).then(function (data) {
				if (data) {
					let attributes = {};
					controller.data.required.forEach((attribute) => {
						if (attribute in req.body) {
							attributes[attribute] = req.body[attribute];
						} else {
							return controller.error(res, 'Missing parameters.');
						}
					});

					controller.data.optional.forEach((attribute) => {
						if (attribute in req.body) {
							attributes[attribute] = req.body[attribute];
						}
					});
					data.updateAttributes(attributes).then(function (entity) {
						controller.success(res, entity);
					});
				} else {
					controller.error(res, 'Entity not found.');
				}
			});
		} else {
			controller.error(res, 'Route data undefined.');
		}
	};
	
	controller.remove = (req,res) => {
		if (controller.data) {
			controller.data.model.findById(req.params[data.id]).then(function (data) {
				if (data) {
					data.destroy();
					controller.success(res, 'Entity deleted.');
				} else {
					controller.error(res, 'Entity not found.');
				}
			});
		}
	};
	
	controller.success = (res, data) => {
		res.json({
			success:true,
			data:data
		});
	};
	
	controller.error = (res, err) => {
		res.statusCode = 500;
		res.json({
			success:false,
			error:err
		});
	};
	
	return controller;
};
