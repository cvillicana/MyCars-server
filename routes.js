var AuthenticationController  = require('./controllers/authentication'),
    UserController            = require('./controllers/user'),
    MeliController            = require('./controllers/meli'),
    CarController             = require('./controllers/car'),
    UploadService             = require('./services/uploadService'),
    express                   = require('express'),
    passportService           = require('./config/passport'),
    passport                  = require('passport'),
    multer                    = require('multer');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

var upload = multer({ dest: './uploads/' });

module.exports = function(app){

    var apiRoutes     = express.Router(),
        carRoutes     = express.Router(),
        meliRoutes    = express.Router(),
        authRoutes    = express.Router(),
        userRoutes    = express.Router(),
        tripRoutes    = express.Router(),
        todoRoutes    = express.Router();

    //Auth Routes
    apiRoutes.use('/auth', authRoutes);
    authRoutes.get('/exists/:email', AuthenticationController.exists);
    authRoutes.post('/facebook', AuthenticationController.authFacebook);
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    // Meli Routes
    apiRoutes.use('/meli', meliRoutes);
    meliRoutes.get('/categories', MeliController.categories);

    //Car Routes
    apiRoutes.use('/cars', userRoutes);
    userRoutes.get('/me', requireAuth, CarController.myCars);
    userRoutes.post('/', requireAuth, CarController.saveCar);
    // userRoutes.put('/me', requireAuth, UserController.updateMyUser);
    userRoutes.post('/images', upload.any(), requireAuth , CarController.uploadImage);

    // Set up routes
    app.use('/api/v1', apiRoutes);

}
