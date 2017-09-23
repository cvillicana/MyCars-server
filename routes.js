var AuthenticationController  = require('./controllers/authentication'),
    TodoController            = require('./controllers/todos'),
    UserController            = require('./controllers/user'),
    UploadService             = require('./services/uploadService'),
    express                   = require('express'),
    passportService           = require('./config/passport'),
    passport                  = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app){

    var apiRoutes     = express.Router(),
        authRoutes    = express.Router(),
        userRoutes    = express.Router(),
        todoRoutes    = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
    authRoutes.get('/exists/:email', AuthenticationController.exists);
    authRoutes.post('/facebook', AuthenticationController.authFacebook);
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    //User Routes
    apiRoutes.use('/users', userRoutes);
    userRoutes.get('/me', requireAuth, UserController.getMyUser);
    userRoutes.put('/me', requireAuth, UserController.updateMyUser);
    userRoutes.post('/me/picture', requireAuth, UserController.uploadImage);

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);
    todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['user','admin']), TodoController.getTodos);
    todoRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['user','admin']), TodoController.createTodo);
    todoRoutes.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['admin']), TodoController.deleteTodo);

    // Set up routes
    app.use('/api', apiRoutes);

}
