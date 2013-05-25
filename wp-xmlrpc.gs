var config = {
  'url' : 'http://cityindex.david-coombes.com/xmlrpc.php',
  'user' : 'admin',
  'pass' : 'chanman'
};

/**
 * main
 */
function main(){
  //get list of users
  var users = wpXmlRPC('wp.getUsers', [
    ["int", 1],
    ["string", config.user],
    ["string", config.pass]
  ]);
  Logger.log(users);

  return;
}

function udpateUser(){
  //update user
  var update = wpXmlRPC('gas_wp.update_user', [
    ["int", 1],
    ["string", config.user],
    ["string", config.pass],
    ["struct", ["content",
      ["int", 1]
      ]
    ]
  ]);
  Logger.log(update);
}

/**
 * make xmlrpc request
 * @param string The endpoint method to call
 * @param array An object array of parameters in the format ["dataType", "value"]
 * @return HTTPResponse
 */
function wpXmlRPC(method, params){

  //build array of xmlrpc request
  var xmlAr = [
   "methodCall",
   ["methodName", method],
   ["params"]
  ];
  for(var i=0;i<params.length;i++){
    xmlAr[2].push(["param",[ "value", [params[i][0],params[i][1] ] ]
    ]);
  }

  //build xml
  var xml = Xml.parseJS(xmlAr);

  //build payload
  var payload = {
    "contentType": "Content-Type: text/plain",
    "method" : "post",
    "payload" : xml.toXmlString()
  };

  //reurn HTTPResponse
  return UrlFetchApp.fetch(config.url, payload);
}