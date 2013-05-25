var config = {
  'url' : 'http://cityindex.david-coombes.com/xmlrpc.php',
  'user' : '***',
  'pass' : '****'
};

/**
 * main
 */
function main(){
  //get list of users
  var users = getUsers();

  return;
}

function getUsers(){

  var users = new Array();

  //make request
  var res = wpXmlRPC('wp.getUsers', [
    ["int", 1],
    ["string", config.user],
    ["string", config.pass]
  ]);

  //get array of <value><struct>...</struct></value>'s
  var xml = Xml.parse(res, false);
  var values = xml.getElement()
             .getElement()
             .param.value.array.data.getElements('value');

  //parse array to json
  for(var i=0; i<values.length; i++){

      //get <members>
    var members = values[i].struct.getElements('member');
    users[i] = new Array();
      //parse <members>
    for(var y=0; y<members.length; y++){
      var name = members[y].name.getText();
      //get dataType
      var dataType = members[y].value.getElement().getName().getLocalName();
      if(dataType=='array'){
      }
      else{
        //get value
        var val = members[y].value.getElement(dataType).getText();
        Logger.log(val);
        users[i].push( [name,val] );
      }
    }
  }

  Logger.log(users);
}

function udpateUser(){
  //update user
  var update = wpXmlRPC('gas_wp.update_user', [
    ["int", 1],
    ["string", config.user],
    ["string", config.pass],
    ["struct", ["content",[
      ["name", 1]
      ]
    ]]
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