# Easy Games 

API for a games recommendations app made as final project to an assignature called "Special Topics in Software Engineering". 

Made with Node.js, Vue.js, Express.js and MongoDB. 

# Web services
```bash
/*********************************************************************************
* Web service: Create a new user
* URI: /api/user/create
* Method: POST
*/
Test example:
{
  "username": "yourUsername",
  "email": "your@email.com",
  "password": "yourPassword",
  "firstName": "Your first name",
  "lastName": "Your last name",
  "birth": "mm/dd/yyyy",
  "steamProfile": "http://your/steam/profile/URL"
}
 
/*********************************************************************************
* Web service: Get the data of the current user (actual session)
* URI: /api/user
* Method: GET
*/

/*********************************************************************************
* Web service: Update the data of the current user (actual session)
* URI: /api/user/update
* Method: PUT
*/
Test example:
{
  "lastName": "Last name to update",
  "steamProfile": "http://your/steam/profile/URL/"
}

/*********************************************************************************
* Web service: Delete the current user (actual session)
* URI: /api/user/delete
* Method: DELETE
*/

/*********************************************************************************
* Web service: Get game by its ID
* URI: /api/game/:gameID
* Method: GET
*/

/*********************************************************************************
* Web service: Update game by its ID
* URI: /api/game/update/:gameID
* Method: PUT
*/
Test example:
{
  "price": 20.3
}

/*********************************************************************************
* Web service: Delete game by its ID
* URI: /api/game/delete/:gameID
* Method: DELETE
*/

/*********************************************************************************
* Web service: Log in with a given username and password
* URI: /auth/login
* Method: POST
*/
Test example:
{
  "username": "yourUsername",
  "password": "yourPassword"
}

/*********************************************************************************
* Web service: Log out of the current session
* URI: /auth/logout
* Method: GET
*/

/*********************************************************************************
* Web service: Create or read a new user with Google account
* URI: /auth/google
* Method: GET
*/

/*********************************************************************************
* Web service: Create or read a new user with a Facebook account
* URI: /auth/facebook
* Method: GET
*/

/*********************************************************************************
* Web service: Get external games from our robot
* URI: /api/externalgames
* Method: GET
*/

/*********************************************************************************
* Web service: Loads signup view
* URI: /signup
* Method: GET
*/

/*********************************************************************************
* Web service: Loads games view
* URI: /games
* Method: GET
*/

/*********************************************************************************
* Web service: Loads sign in view
* URI: /signin
* Method: GET
*/

/*********************************************************************************
* Web service: Create a new fav game for user
* URI: /api/user/addFavGame
* Method: POST
*/
Test example:
{
  "name": "Game name",
  "picture": "http://path/to/picture",
  "price": 35.5,
  "link": "http://link/to/picture"
}

*********************************************************************************
* Web service: Delete fav game of the current user (actual session)
* URI: /api/user/deleteFavGame
* Method: POST
*/
{
  gameid: "A mongo objectid stored in db"
}
```
