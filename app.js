import express from 'express'; //loads the express framework so i can build an HTTP server
import mongoose from 'mongoose';
import enrollmentsRouter from './routes/enrollments.js';
import passport from './auth.js';
import session from 'express-session';

try {
    await mongoose.connect(process.env.MONGDB_URI || 'mongodb://localhost:27017/schoolDB');
    console.log('Mongo connected');
} catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
}
//Database or connection errors

function isLoggedIn(req, res, next){
    req.user? next() : res.sendStatus(401); //if request has a user, we bring it to the next point
    //if they don't, return a status 401
}


const app = express();

app.use(session({
    secret:'cats',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json()); //reads the JSON request body and turns it into a JavaScript object

app.use(express.urlencoded({extended: false}));

function ensureLoggedIn(req, res, next){
    if (req.isAuthenticated && req.isAuthenticated()) return next();//it’s “does the function exist?” and “does it return true?”.
    req.session.returnTo = req.originalUrl; //// Save the originally requested URL so we can redirect back after login
    return req.session.save(()=>res.redirect('/login'));
}

//logger middleware
app.use((req, res, next)=>{
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.get('/', (req, res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/login', (req, res)=>{
    res.send(`
        <form method = "POST" action = "/login">
        <input name ="username" placeholder = "username"/>
        <input name = "password" type = "password" placeholder = "password" />
        <button type = "submit">Login</button>
        </form>
        `);
});

app.post('/login', (req, res, next)=>{
    passport.authenticate('local', (err, user)=>{
        if (err) return next(err);
        if (!user) return res.redirect('/login');

        const redirectTo = req.session.returnTo || '/protected';

        req.logIn(user, err => {
            if (err) return next(err);
            delete req.session.returnTo;
            return res.redirect(redirectTo);
        });
    })(req, res, next);
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile']})
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    })
);

app.get('/auth/failure', (req, res)=> {
    res.send('Something went wrong..')
});

app.get('/protected', ensureLoggedIn, (req, res)=> {
    res.send(`Hello ${req.user.displayName || req.user.username}`);
});

app.get('/logout', (req, res, next)=>{
    req.logout(err=>{
        if (err) return next(err);
        req.session.destroy(()=>{
            res.send('Goodbye!')
        });  
    });
});


app.get('/health', (req, res)=>
    res.json({status:'ok'})
);

app.use('/enrollments', ensureLoggedIn, enrollmentsRouter);//mounting the router at /enrollments-- prefixes all its routes

app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).json({error: 'Server error'});
});

const PORT = process.env.PORT || 3000; //picking the port number the server listens on

app.listen(PORT, ()=> 
    console.log(`Server running on http://localhost: ${PORT}`)
);
