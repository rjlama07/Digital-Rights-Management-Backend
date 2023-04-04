# Vehical-Rental-System-backend-nodejs


API DOCUMENTATION

Base url=https://rentgaram.onrender.com

Note: on render is a free API hosting service so it needs to cold start for the use.    Signup- POST Request

Endpoint= user/signup

Request
{
  “firstName”:firstName,
   “lastName”:lastName,
  “email”:String,
  “password”:String, }

Response-200 {
    message:”User created successfully”

Response-409 {
    Error: “User with this email already exist”
}

Response-500 {
    Error: “Internal Server Error”
}

Login- POST Request

Endpoint= user/login

Request
{
  “email”:String
  “password”:String }



Response-200 {
    "firstName": String,
    "email":String ",
    "role": String,
    "firstName": String,
    "lastName": String, 
    "accessToken":String
}

Response-401 {
    Error: “Invalid email and Password”
}

Response-500 {
    Error: “Internal Server Error”
}
