var domain = "http://0.0.0.0";

var settings = {
  ipaddr     : process.env.NODE_IP || "0.0.0.0",
  port       : process.env.NODE_PORT || 3000,
  site		 : domain,
  secret	 : process.env.SHIFTS_SECRET || "3_0vt95#rhfp_j2+^t4py@xu=z8qm!)0v_@!nz%nn9nvu)tzsol2",
  jwt		 : {
	issuer	  			: domain,
	audience  			: domain,
	expiresInMinutes	: 60 * 24,
	algorithm 			: "HS256"
  },
  roles		 : ['ADMINISTRATOR', 'MANAGER', 'WORKER'],
  mongodb    : {
    host     : "127.0.0.1",
    database : "shifts-backend"
  }
};

module.exports = settings;
