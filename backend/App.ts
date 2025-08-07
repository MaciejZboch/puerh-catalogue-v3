//Dependency imports
import express, {NextFunction, Request, Response} from 'express'
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import helmet from 'helmet';
import passport from 'passport';
import flash from 'connect-flash';
const LocalStrategy = require("passport-local");
const app = express();

//Other imports
import User from './models/user';
import { IUser } from './models/user';

//MongoDB setup
const dbUrl = 'mongodb://localhost:27017/test';
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Mongo connection succesful!');
  })
  .catch((err) => {
    console.log('Mongo error!');
    console.log(err);
  });

//Session setup
app.use(session({
  secret: 'c134cY87K43o',
  store: MongoStore.create({ 
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'c134cY87K43o'
  }
})
.on("error", function (e) {
  console.log("session store error!", e);
})
}));
app.use(flash()); //Flash setup
app.use(helmet()); //Helmet setup

//Passpor setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(User.deserializeUser());

//Locals setup
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.user;
  res.locals.baseUrl = req.baseUrl;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.filters = req.query;
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.listen(3000)