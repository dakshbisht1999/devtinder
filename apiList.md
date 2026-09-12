# authRouter
POST - /auth/signup
POST - /auth/login
POST - /auth/logout
PATCH - /auth/password/reset  // using otp on email


# profileRouter
GET - /profile/view
PATCH - /profile/edit
PATCH - /profile/password
DELETE - /profile/delete


# requestRouter
POST - /request/send/:status/:userId       // status: interested, ignored
POST - /request/review/:status/:requestId  // status: accepted, rejected


# userRouter
GET - /user/requests/received (with pagination)
GET - /user/connections (with pagination) // status: accepted
GET - /user/feed (with pagination)


# chatRouter [webSockets concept]
/chat/list
/chat/:chatId
/chat/message/sent


Build forgert password API for already logged out user (send otp on registered email using 2 way, ask user to write the registered email and then ask for the otp sent on the mail)


whenever user do forget password, then make sure to ask him for logout from other devices


restrict user actively login only number of devices

