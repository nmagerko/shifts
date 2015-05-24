var domain = "http://0.0.0.0";
var jwt = {
	secret 	  : process.env.SHIFTS_SECRET || "3_0vt95#rhfp_j2+^t4py@xu=z8qm!)0v_@!nz%nn9nvu)tzsol2",
	issuer	  : domain,
	audience  : domain,
	algorithm : "HS256",
	expires_in_minutes	: 60 * 24
}

var settings = {
  ipaddr     : process.env.NODE_IP || "0.0.0.0",
  port       : process.env.NODE_PORT || 3000,
  site		 : domain,
  passport	 : {
  	jwt		 : {
  		secretOrKey	: jwt.secret,
		issuer	 	: jwt.issuer,
		audience 	: jwt.audience
  	}
  },
  jwt		 : jwt,
  mongodb    : {
    host     : "127.0.0.1",
    database : "shifts-backend"
  }
};

module.exports = settings;
