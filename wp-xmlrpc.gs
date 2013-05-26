var sheetName = "WP Users";
var columns = ["username", "email", "display_name", "first_name", "last_name",
                "bio","nickname","registered","roles","nicename","url"];

/**
 * main
 */
function onOpen(){
  
  //add menu
  var ss = SpreadsheetApp.getActive();
  var entries = [{
    name : sheetName,
    functionName : "getUsers"
  }];
  ss.addMenu(sheetName, entries);
}

/**
 * Checks if config object values are set.
 * Will alert errors and return false if values missing, else returns true.
 * @return {boolean}
 */
function checkConfig( config ){
  
  //build error array
  var msg = new Array();
  if(!config.user.length)
    msg.push('Please set config.user');
  if(!config.pass.length)
    msg.push('Please set config.pass');
  if(!config.url.length)
    msg.push('Please set config.url');
  
  //if errors alert user
  if(msg.length){
    str = "There were configuration errors...\n";
    Browser.msgBox(str + msg.join('\n'));
    return false;
  }
  return true;
}

/**
 * Makes xmlrpc request to wordpress blog for users.
 *
 * @param {object} params An ojbect of config settings in format obj.user, obj.pass, obj.url
 * @return {array} An array of objects of user details that can be passed directly to Sheet
 */
function getUsers(params){
  
  //check params
  if(!checkConfig(params))
    return;  
  
  //vars
  var users = new Array();
  if(!params.blog_id) params.blog_id = 1;
  
  //make request
  var res = wpXmlRPC('wp.getUsers', params.url, [
    ["int", params.blog_id],
    ["string", params.user],
    ["string", params.pass]
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
    users[i] = {
      "username" : "",
      "first_name" : "",
      "last_name" : "",
      "registered" : "",
      "bio" : "",
      "email" : "",
      "nickname" : "",
      "nicename" : "",
      "url" : "",
      "display_name" : "",
      "roles" : ""
    };
    
    //parse <members>
    for(var y=0; y<members.length; y++){
      var name = members[y].name.getText();
      //get dataType
      var dataType = members[y].value.getElement().getName().getLocalName();
      
      if(dataType=='array'){
        var vals = members[y].value.array.data.getElements('value');
        var val = new Array();
        for(var a=0; a<vals.length; a++){
          val.push(vals[a].getElement().getText());
        }
      }
      else{
        //get value
        var val = members[y].value.getElement(dataType).getText();
      }
      users[i][name] = val;
    }
  }
  
  return setSheet( users );
}

/**
 * Builds the column headers for the WP Users sheet
 * @param {Sheet} sheet The WP Users sheet
 */
function setHeader(sheet){
  var cols = [ columns ];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = sheet.getRange(1, 1, 1, cols[0].length)
    .setValues(cols); //row, column, numRows, numColumns
}

function setSheet(users){
  
  /**
   * Create WP Users sheet
   */
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = null;
  
  //check if sheet open, else create it
  for(var i=0; i<sheets.length; i++){
    if(sheets[i].getName()==sheetName){
      var sheet = sheets[i];
      break;
    }
  }
  if(!sheet)
    var sheet = ss.insertSheet(sheetName);
  setHeader(sheet);
  // end Create WP Users sheet
  
  //update rows
  for(var i=0; i<users.length; i++){
    var row = [];
    for(var y=0; y<columns.length; y++){
      row.push( users[i][columns[y]] );
    }
    sheet.appendRow(row);
  }
}

/**
 * update user
 */
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
}

/**
 * make xmlrpc request
 * @param string The xmlrpc method to call
 * @param string The wordpress url to xmlrpc.php
 * @param array An object array of parameters in the format ["dataType", "value"]
 * @return HTTPResponse
 */
function wpXmlRPC(method, url, params){

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
  return UrlFetchApp.fetch(url, payload);
}