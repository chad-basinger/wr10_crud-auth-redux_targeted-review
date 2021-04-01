require('dotenv').config();
const session = require('express-session')
const express = require('express');
const app = express();
const massive = require('massive');
const authCtrl = require('./controllers/authController');
const jokesCtrl = require('./controllers/jokesController');

const { SERVER_PORT, DB_STRING, SESSION_SECRET } = process.env;

app.use(express.json())

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }
  )
)

//auth endpoints - match the authController.js module.exports handler functions
app.post('/auth/register', authCtrl.register) //req.body
app.post('/auth/login', authCtrl.login) //req.body
app.delete('/auth/logout', authCtrl.logout) //receive no data
app.get('/auth/session', authCtrl.getSession) // receive no data

//jokes endpoints
app.get('/api/jokes/', jokesCtrl.getJokes) //optionally receives a query
app.post('/api/jokes', jokesCtrl.addJoke) //req.body (and gets users ID from session)
app.put('/api/jokes/:joke_id', jokesCtrl.editJoke) // req.params, req.body
app.delete('/api/jokes/:joke_id', jokesCtrl.deleteJoke) //req.params



massive({
    connectionString: DB_STRING,
    ssl: {
      rejectUnauthorized: false,
    },
}).then((dbInstance) => {
    app.set('db', dbInstance)
    app.listen(SERVER_PORT, () =>
      console.log(`DB is up & Server smashing it on port ${SERVER_PORT}`)
    )
}).catch(err => {
    console.log(err)
});