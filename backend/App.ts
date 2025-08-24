//Dependency imports
import express, {NextFunction, Request, Response} from 'express'
import mongoose from 'mongoose';
import session, {SessionData} from 'express-session';
import MongoStore from 'connect-mongo'
import helmet from 'helmet';
import passport from 'passport';
import flash from 'connect-flash';
const LocalStrategy = require("passport-local");
const app = express();
import cors from 'cors';

//Other imports
import User from './models/user';
import userRoutes from "./routes/users";
import teaRoutes from "./routes/tea";
import reviewRoutes from "./routes/review";
import editRoutes from "./routes/edit"
import moderateRoutes from "./routes/moderate"

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

//Cors setup
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true //allow cookies/auth headers
})); 

//Session setup
app.use(session({
  secret: 'c134cY87K43o',
  store: MongoStore.create({ 
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'c134cY87K43o'
  }
}),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Enable in production with HTTPS
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
})).on("error", function (e) {
  console.log("session store error!", e);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === "GET" &&
    req.path !== "/login" &&
    req.path !== "/logout" &&
    req.path !== "/favicon.ico" &&
    !req.path.startsWith("/tea/stylesheets") && //Ignore CSS
    !req.path.startsWith("/images") && //Ignore images
    !req.path.startsWith("/scripts") //Ignore scripts
  ) {
    req.session.save((err) => {
      if (err) console.log("Session save error:", err);
    });
  }
  next();
});

app.use(flash()); //Flash setup
app.use(helmet()); //Helmet setup

//Passport setup
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

//Routes setup
app.use("/", userRoutes);
app.use("/api/teas", teaRoutes);
app.use("/api/teas", reviewRoutes);
app.use("/api/edit", editRoutes);
app.use("/api/moderate", moderateRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.listen(4000)