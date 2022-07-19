const express = require('express');
const haversine = require('haversine-distance');
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

// Starts a session and directs the user to the questions page
app.post('/start-session', async (req, res) => {
    app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
        long: req.body.long,
        lat: req.body.lat,
    }));

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
    
    var sessionStatus = "Session Started!";

    res.render('index', { data: questions, sessionStuff: sessionStatus});
});

app.get('/', async (req, res) => {
    const sesh = req.session;
    let sessionStatus;
    if (sesh) {
        sessionStatus = "Session Started!"
    } else {
        sessionStatus = "Session is not active";
    }
    const queryGetQuestions = datastore
    .createQuery("Question")
    // .order("time", {
    //     descending: true
    // });
    const [questions] = await datastore.runQuery(queryGetQuestions);
    const viewerCoords = [sesh.lat, sesh.long];
    function getShorterDistance(a, b) {
        const aCoords = [a.lat, a.long];
        const bCoords = [b.lat, b.long];
        if (haversine(viewerCoords, aCoords) < haversine(viewerCoords, bCoords))
            return -1;
        return 1;
    }
    questions.sort(getShorterDistance);

    const questionsAndReplies = await Promise.all(questions.map(async q => { 
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
    
    res.render('index', { data: questionsAndReplies, default: req.query.question, sessionStuff: sessionStatus});
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
    const body = {
        text: req.body.question,
        time: new Date(),
        long: req.body.long,
        lat: req.body.lat,
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
        long: req.body.long_question,
        lat: req.body.lat_question,
        online: true
    };
    await insertRow.insert("Users", body);

    return res.render("index");
});

app.get("/meet", (req, res) => {
    var sessionStatus;
    if (req.session) {
        sessionStatus = "session active"
    } else {
        sessionStatus = "session not active";
    }
    return res.render("meet", {sessionStuff: sessionStatus });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});