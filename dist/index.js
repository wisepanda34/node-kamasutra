"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUNDED_404: 404
};
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'devops' }
    ]
};
app.get('/', (req, res) => {
    res.json({ message: "it-incubator" });
});
app.get('/users', (req, res) => {
    res.send('Hello USERS!');
});
app.post('/users', (req, res) => {
    res.send('We have created new user!');
});
app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    //если есть query параметры
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
    }
    // if(!foundCourses.length){
    //   res.sendStatus(400)
    //   return
    // }
    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    }
    res.json(foundCourse);
});
app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUS.CREATED_201).json(createdCourse);
});
app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        return res.sendStatus(400);
    }
    foundCourse.title = req.body.title;
    res.status(204);
});
app.get('/books', (req, res) => {
    const b = 2;
    if (b > 10)
        res.send('That are our books!!!! WoW!!!');
    else
        res.send("that's not enough books");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
