// index.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000; 
const SESSION_SECRET = 'mysecretkey';
// Use cookie-parser middleware
app.use(cookieParser());
// Load environment variables
dotenv.config({ path: 'config.env' });
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());

// MongoDB connection
const connectDB = require('./server/database/connection');

// Access PORT from environment variables or default to 8080

// Log requests
app.use(morgan('tiny'));
app.use(express.json());


// MongoDB connection
connectDB();

const authRoutes = require('./routes/authRoutes');
const adminauthRoutes = require('./routes/adminauthRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/css', express.static(path.resolve(__dirname, 'views', 'CSS')));
app.use('/assets', express.static(path.resolve(__dirname, 'views','Assets')));
app.use('/assets', express.static(path.resolve(__dirname, 'views','Assets','Movie_Products')));
app.use('/assets', express.static(path.resolve(__dirname, 'views','Assets','Cartoon_Products')));
app.use('/js', express.static(path.resolve(__dirname, "views/js")));
app.use('/admin', express.static(path.resolve(__dirname, "views/admin")));
app.use('/scss', express.static(path.resolve(__dirname, "views/scss")));
app.use('/vendor', express.static(path.resolve(__dirname, "views/vendor")));

app.set('view engine', 'ejs');

app.use(authRoutes); // Mount the authentication routes
app.use(adminauthRoutes);
app.use(adminRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
