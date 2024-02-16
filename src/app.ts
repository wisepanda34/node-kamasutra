import express, {Request, Response} from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'
import { QueryCourseModel } from './models/QueryCoursesModel'
import { CreateCourseModel } from './models/CreateCourseModel'
import { UpdateCourseModel } from './models/UpdateCourseModel'
import { CourseViewModel } from './models/CourseViewModel'
import { UriParamsCourseIdModel } from './models/UriParamsCourseIdModel'


const app = express()

const HTTP_STATUS = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  NOT_FOUNDED_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
  id: number,
  title: string,
  countStudents: number
}

const db:{courses: CourseType[]}  = {
  courses: [
    {id:1, title: 'front-end', countStudents: 10},
    {id:2, title: 'back-end', countStudents: 12},
    {id:3, title: 'devops', countStudents: 15}
  ] 
}

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title
  }
}
 


app.get('/courses', (req: RequestWithQuery<QueryCourseModel>, 
                     res: Response<CourseViewModel[]>) => {
  let foundCourses = db.courses
  
  //если есть query параметры
  if(req.query.title){
    foundCourses = foundCourses.filter(c=>c.title.indexOf(req.query.title) > -1)
   }

  res.json(foundCourses.map(getCourseViewModel));
})

app.get('/courses/:id', (req: RequestWithParams<UriParamsCourseIdModel>, 
                         res: Response<CourseViewModel>) => {
  const foundCourse = db.courses.find(c=>c.id === +req.params.id)

  if(!foundCourse){
    return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
  }
  res.json(getCourseViewModel(foundCourse))
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
                      res: Response<CourseViewModel>)=> {
  if(!req.body.title){
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    return
  }

  const createdCourse: CourseType = {
    id: +(new Date()),
    title: req.body.title,
    countStudents: 0
  }
  db.courses.push(createdCourse)
  res.status(HTTP_STATUS.CREATED_201).json(getCourseViewModel(createdCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<UriParamsCourseIdModel>, res) => {
  db.courses = db.courses.filter(c=>c.id !== +req.params.id)
 
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<UriParamsCourseIdModel, UpdateCourseModel>, res) => {
  if(!req.body.title){
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    return
  }

  const foundCourse = db.courses.find(c=>c.id === +req.params.id)

  if(!foundCourse){
    return res.sendStatus(404)
  }
  foundCourse.title = req.body.title
  res.sendStatus(204).json(foundCourse)
})


app.delete('/__test__/data', (req,res)=>{
  db.courses = []
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

export { app }; 