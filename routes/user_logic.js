/*
* ============================================
*	All logic related to the user on the server |
* ============================================
*/

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});


var user = {


	first_name : 'César',
	last_name : 'Cruz',
	email : 'cesarcruz91@gmail.com',
	password : 'forkit', //This will be hashed.
	phone : '7874526702',
	mail_address1 : '#311 Calle Ext. Los Robles',
	mail_address2 : '',
	mail_city : 'Rincon',
	mail_state : 'Puerto Rico',
	mail_zip : '00677',
	bill_address1 : '#311 Calle Ext. Los Robles',
	bill_address2 : '',
	bill_city : 'Rincon',
	bill_state : 'Puerto Rico',
	bill_zip : '00677',
	image : 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash4/1009521_322256844573732_661186218_o.jpg',
	cc_number : '2938 8493 1739 0394',

	notifications:[


	{
		date: "Oct 03, 2013 - 12:21pm",
		description: "Your bid on \"Coors Light 12 pack\" was outbidded",
		link: ""


	},
	{
		date: "Oct 04, 2013 - 2:01am",
		description: "You won the bid on the new \"iPad 7\"",
		link:""

	},

	{

		date: "September 21, 2013 - 12:00am",
		description: "Credit card ending with \"*0394\" has expired.",
		link: ""
	}


	],

	bids:[
	{	
		date: "October 2, 2013 - 2:10pm",
		item_name: "Charizard",
		amount: "$2.00",
		seller: "Luis Medina",
		image: "http://cdn.bulbagarden.net/upload/thumb/7/7e/006Charizard.png/256px-006Charizard.png",
		link: ""



	},

	{
		date: "October 1, 2013 - 9:00pm",
		item_name: "Sword",
		amount: "$15.00",
		seller: "Jose Martinez",
		image: "http://images4.wikia.nocookie.net/__cb20130105173711/runescape/images/c/cb/Steel_sword_detail.png",
		link: ""



	},

	{
		date: "September 19, 2013 - 7:45am",
		item_name: "Harry Potter: The Prisoner of Azkaban",
		amount: "$13.50",
		seller: "John Smith",
		image: "http://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg",
		link:""
	},
	{
		date: "September 12, 2013 - 8:45am",
		item_name: "Suitcase",
		amount: "$56.00",
		seller: "Xin Perez",
		image: "http://1.bp.blogspot.com/_MWG4tkTfz8M/SwvRjlHN66I/AAAAAAAAAVs/nKIUTHnKsFI/s320/Vintage_Suitcase_-_V%26M.jpg",
		link:""
	}
	],

	listings:[
	{

	  name : "Kick Ass Ball",
	  description: "This is one kickass ball",
	  date : "August 2, 2013",
	  brand : "CoolShiii",
	  category: "Toys",
	  price : "Price: $2.35",
	  image : "http://static.giantbomb.com/uploads/scale_small/0/6393/528516-1ball2.jpg",
	  auction_flag: false

	},
	

	{ name : "Nexus 4",
	  description: "Because it's awesome!",
	  date : "September 8, 2013",
	  brand : "Google",
	  category : "Tablets",
	  price : "Current Bidding: $253.30",
	  image : "http://www.notebookcheck.net/fileadmin/_migrated/pics/nexus4-1_02.png",
	  auction_flag: false
	}
	]
};


// User notifications

/*
*	Check the user credentials for a sign in, no hashing whatsoever so far.
*/
var sign_in = function(req, res, next)
{

	connection.query('select * from client natural join address where client.email = '+connection.escape(req.body.username) +'and address.is_primary = 1', function(err, rows){
		if (!err)
			if(rows[0].password == req.body.password)
				res.send(rows[0])
			else
				res.send({error : 'Incorrect'});
		else{
			console.log(err);
			res.send({error : 'dumbass'});
		}
			console.log(err);
	})
}

/**
*	Modify the user and send the new user to the client.
*/
var update_user = function(req, res, next)
{
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;

	res.send(user);
}

/*
*	Get the addresses for a specific user
*/
var user_addresses = function(req, res, next)
{
	connection.query('select * from address where client_id = '+connection.escape(req.param('id')), function(err, rows){
		if(!err)
			res.send({ content : rows});
		else
			res.send('Error');
	});
}

var add_mail_address = function(req, res, next)
{
	var new_address = {
		mail_address1 : req.body.address1,
		mail_address2 : req.body.address2,
		mail_city : req.body.city,
		mail_state : req.body.country,
		mail_zip : req.body.zipcode
	};

	addresses.content.push(new_address);

	//Confirm that all is well
	res.send(200);
}

var delete_address = function(req, res, next)
{
	for(var i = 0; i < addresses.content.length; i++)
	{
		if(addresses.content[i].mail_address1 == req.body.address1)
		{
			addresses.content.splice(i, 1);
		}
	}
	res.send(200);
}

var get_notifications = function(req, res,err)
{

}

var get_bids = function(req, res, err)
{
	console.log(req.param('client_id'));
	connection.query('select distinct * from bidding_history where bidder_id = '+connection.escape(req.param('client_id')), function(err, rows)
	{
		if (!err)
			res.send({content : rows});
		else
			console.log(err);
	});
}

var get_listings = function(req, res, err)
{

	res.send(user.listings);
}

exports.get_listings = get_listings;
exports.get_bids = get_bids;
exports.get_notifications = get_notifications;
exports.sign_in = sign_in;
exports.update_user = update_user;
exports.user_addresses = user_addresses;
exports.add_mail_address = add_mail_address;
exports.delete_address = delete_address;



