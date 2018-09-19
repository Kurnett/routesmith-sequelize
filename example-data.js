module.exports = {
	id:'userID',
	belongsTo:'',
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