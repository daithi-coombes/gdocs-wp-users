gdocs-wp-users
==============

make CRUD calls to user profiles in wordpress using gdocs spreadsheet.

Installation
============
 1. Download and manually install this repo to your blog
 2. Open spreadsheet in docs.google.com
 3. Navigate to: Tools -> script editor
 4. In Script Editor Load the gas-wp-users library:
   - Navigate to: Resources -> Manager libraries
   - In 'Find a library' Enter: `MmjV7erWgAyEuJXAjB_r4gonumMDP2k22`
   - Click 'select' and 'save'
   - Enter the following code in editor

```javascript
var wpUsersConfig = {
    'user' : 'myBlogUser',
    'pass' : 'myBlogPswd',
    'url' : 'http://example.com/xmlrpc.php'
};

/**
 * call library onOpen
 */
function onOpen(){
  gdocswpusers.onOpen();  //creates the menu item
}

/**
 * wrapper for gdocswpusers.getUsers()
 */
function getUsers(){
  gdocswpusers.getUsers( wpUsersConfig );
}

/**
 * wrapper for gdocswpusers.udpateUsers()
 */
function udpateUsers(){
  gdocswpusers.udpateUsers( wpUsersConfig );
}
 ```
    - Click 'save'
    - Refresh your spreadsheet window

Usage
=====
When installed a new menu 'WP Users' will appear in your spreadsheet
To edit your wordpress users navigate to: WP Users -> WP Users