# Backend for test task for CTRL+ 


##Link to [backend](https://back-for-ctrl.onrender.com)  
##Link to [frontend](https://front-for-ctrl.onrender.com/)  

**Functionality:**  
 - CRUD of users,  
 - administrate of places from map (add place, delete, find by keyword, get all places),  
 - administrate of reviews (add review for place, get reviews for place, update, delete, find by keyword, fort by rating or adding darte).

### Details of functionality: 
**CRUD of users:**  
*POST http://localhost:3000/login/ - Login request with email and password in body*  
*POST http://localhost:3000/register/ - Register request with email, name and password in body*  
*GET http://localhost:3000/users/ - Get request to get all users*  
*GET http://localhost:3000/users/me/ - Get request to get informatin about current user. Bearer token needed*  
*PATCH http://localhost:3000/users/me/ - Request to ubdate informatin about current user. Bearer token needed*  

**administrate of places:**  
*GET http://localhost:3000/places/ - Get request to get all places*  
*POST http://localhost:3000/places/ - Request to add new place with placeName, latitude and longitude in body. Bearer token needed*  
*DELETE http://localhost:3000/places/:id/ - Delete request. Bearer token needed*    
*GET http://localhost:3000/places/search?query=placeName/ - Get request to find all places by keyword "placeName"*  

**administrate of reviews:**  
*GET http://localhost:3000/:placeId/reviews/ - Get request to get all reviews for place (placeId)*  
*POST http://localhost:3000/:placeId/reviews/ - Request to add new review for place (placeId), with rating (1-5) and comment in body. Bearer token needed*    
*PUT http://localhost:3000/reviews/:id/ - Request to update review for place (placeId), with rating (1-5) and comment in body. Bearer token needed*  
*DELETE http://localhost:3000/reviews/:id/ - Delete request for review. Bearer token needed*    
*GET http://localhost:3000/:placeId/reviews/search?keyword=someKeyword/ - Get request to find reviews of place by keyword "someKeyword"*  
*GET http://localhost:3000/:placeId/reviews?sortBy=rating|date/ - Get request to sort reviews of place by rating or date" *  


**Used:**   
- Node.js   
- Express.js *Web application framework*  
- PNPM *npm manager. It's fast*  
- JsDoc *To generate documentation for code*  
- MongoDB *It's realy cool to organise users. But for reviews i'd better use sql database*   
- Mongoose *To work with Mongo* 
- Libs to make API work: bcryptjs, celebrate, cors, jsonwebtoken, validator, helmet 
- Prettier и Eslint   
- Bruno *Best Opensource API client*  

**Explore:**   
- Install local MongoDB server and start it,  
- Install Node.js,
- clone git repo to your computer and cd into cloned directory,
- Enter "pnpm install" in bash/shell/powershell commander,
- Start project or run it in dev mode (npm start / npm run dev).
- All request for API are saved in Bruno app folder "brunoRequests". Install bruno and import them. 
- To explore code documentation enter "./out/" folder and start index.js file.  

.env-file included, because it's a test backend server
