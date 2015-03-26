var settings = {
  ipaddr     : process.env.NODE_IP || "0.0.0.0",
  port       : process.env.NODE_PORT || 3000,
  mongodb    : {
    host     : "127.0.0.1",
    database : "shifts-backend"
  }
};

module.exports = settings;
