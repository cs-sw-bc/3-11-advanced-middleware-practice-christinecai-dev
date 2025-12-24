import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import User from './models/user.js'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2';
import dotenv from 'dotenv';

dotenv.config();

//local strategy: username + passport
passport.use(new LocalStrategy(async(username, password, done)=>{
    try{
        const user = await User.findOne({username});
        if (!user) return done(null, false, {message: 'User not found'});
        if (user.password != password) return done(null, false, {message: 'Wrong password'});
        return done(null, user);
    }catch(err){
        return done(err);
    }
}));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {//this function runs after Google successfully authenticates the user
    try{
        let user = await User.findOne({googleId: profile.id});
        if(!user){
            user = await User.create({
                googleId: profile.id,
                username: profile.email
            });
        }
        return done(null, user);//tell Passport "authentication succeeded, here's the user"
        //done is the callback: the function you call to finish the auth step and pass back the result
    } catch(err){
        return done(err)
    }    
    }
));

passport.serializeUser(function(user,done){
    done(null,user);//saving the user information in this session
});

passport.deserializeUser(function(user,done){
    done(null,user);//retrieving the user data when needed
});

export default passport;
