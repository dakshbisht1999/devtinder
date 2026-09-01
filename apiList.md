# authRouter
POST - /auth/signup
POST - /auth/login
POST - /auth/logout


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
GET - /user/connections (with pagination)
GET - /user/feed (with pagination)


# chatRouter [webSockets concept]
/chat/list
/chat/:chatId
/chat/message/sent