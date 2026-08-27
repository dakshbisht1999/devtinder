# authRouter
POST - /auth/signup
POST - /auth/login
POST - /auth/logout


# profileRouter
GET - /profile/view
PATCH - /profile/edit
PATCH - /profile/password
DELETE - /profile/delete


# userRouter
GET - /user/feed (with pagination)
GET - /user/requests/received (with pagination)
GET - /user/connections (with pagination)


# requestRouter
POST - /request/send/:status/:userId       // status: interested, ignored
POST - /request/review/:status/:requestId  // status: accepted, rejected


# chatRouter [webSockets concept]
/chat/list
/chat/:chatId
/chat/message/sent