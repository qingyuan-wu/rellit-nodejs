const express = require('express');
const session = require('express-session');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/scripts'));
const bodyParser = require('body-parser');

// Rellit favicon
const favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Imports the Google Cloud client library
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const insertRow = require('./lib/insertRow');

// Allow express to read the POST request body
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/start-session', async (req, res) => {
    app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
    }));
});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', async (req, res) => {
    var sessionStatus;
    if (req.session) {
        sessionStatus = "Welcome!"
    } else {
        sessionStatus = "Sign in to leave a comment!";
    }
    const queryGetQuestions = datastore
    .createQuery("Question")
    .order("time", {
        descending: true
    });
    const [out] = await datastore.runQuery(queryGetQuestions);
    const questions = await Promise.all(out.map(async q => { 
        const questionId = q[datastore.KEY].id;
        const queryGetReplies = datastore.createQuery("Reply")
        .filter("questionId", "=", questionId)
        .order("time", {
            descending: true
        });

        const [replies] = await datastore.runQuery(queryGetReplies);
            
        return {
            "questionId": questionId,
            "text": q.text,
            "time": q.time,
            "replies": replies,
        };   
    }));
    

  res.render('index', { data: questions, default: req.query.question, sessionStuff: sessionStatus});
});

app.get('/questions', async (req, res) => {
    var sessionStatus;
    if (req.session) {
        sessionStatus = "session active"
    } else {
        sessionStatus = "session not active";
    }
    const queryGetQuestions = datastore
    .createQuery("Question")
    .order("time", {
        descending: true
    });
    const [out] = await datastore.runQuery(queryGetQuestions);
    const questions = await Promise.all(out.map(async q => { 
        const questionId = q[datastore.KEY].id;
        const queryGetReplies = datastore.createQuery("Reply")
        .filter("questionId", "=", questionId)
        .order("time", {
            descending: true
        });

        const [replies] = await datastore.runQuery(queryGetReplies);
            
        return {
            "questionId": questionId,
            "text": q.text,
            "time": q.time,
            "replies": replies,
        };   
    }));

    res.render('index', { data: questions, sessionStuff: sessionStatus });
});

app.post('/new-question', async (req, res) => {
    const question = req.body.question;

    const body = {
        text: question,
        time: new Date(),
    };
    await insertRow.insert("Question", body);
    
    res.status(200).redirect("/");
});

app.post('/new-meetup', async (req, res) => {
    try {
        const meetup = req.body.meetup;

        const body = {
            text: meetup,
            time: new Date(),
        };
        await insertRow.insert("MeetUp", body);

        res.status(200).render('index');
    }
    catch {
        res.status(500).json({ message: "internal server error 500" });
    }
});

app.post('/reply', async (req, res) => {
    let body = req.body;
    body["time"] = new Date();
    await insertRow.insert("Reply", body);

    return res.redirect(`/?question=${body.questionId}`);
});

app.post('/login', async (req, res) => {
    const body = {
        email: req.body.email,
        firstname: req.body.given_name,
        lastname: req.body.family_name,
        profilePicture: req.body.picture,
        long: req.body.long,
        lat: req.body.lat,
        online: true
    };
    await insertRow.insert("Users", body);

    return res.render("index");
});

app.get("/meet", (req, res) => {
    return res.render("meet");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});