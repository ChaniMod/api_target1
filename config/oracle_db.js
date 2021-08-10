// var mypw = "tech"
// var oracledb = require('oracledb');
// oracledb.getConnection(
//   {
//     user          : "sajet",
//     password      : mypw,
//     connectString : "10.80.10.18:1521/mesdb"
//   },
//   function(err, connection)
//   {
//     if (err) { console.error(err); return; }
    
//   });

const connonsql = async function (dbconfig) {
  var mypw = "tech"
  var oracledb = require('oracledb');
  oracledb.getConnection(
  {
    user          : "sajet",
    password      : mypw,
    connectString : "10.80.10.18:1521/mesdb"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    
  });
}
module.exports = {
    connonsql
}