// src/routes/courses.ts
import express, {Request, Response, Express} from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'
import { QueryCourseModel } from '../models/QueryCoursesModel'
import { CreateCourseModel } from '../models/CreateCourseModel'
import { UpdateCourseModel } from '../models/UpdateCourseModel'
import { CourseViewModel } from '../models/CourseViewModel'
import { UriParamsCourseIdModel } from '../models/UriParamsCourseIdModel'
import { DBType, CourseType } from '../db/db'
import {HTTP_STATUS} from '../constants/http-status'



const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title
  }
}

export const getCoursesRoutes = (db: DBType) => {
  const coursesRouter = express.Router()

  coursesRouter.get('/', (req: RequestWithQuery<QueryCourseModel>, 
    res: Response<CourseViewModel[]>) => {
      let foundCourses = db.courses

      //если есть query параметры
      if(req.query.title){
        foundCourses = foundCourses.filter(c=>c.title.indexOf(req.query.title) > -1)
      }

    res.json(foundCourses.map(getCourseViewModel));
  })

  coursesRouter.get('/:id', (req: RequestWithParams<UriParamsCourseIdModel>, 
    res: Response<CourseViewModel>) => {
      const foundCourse = db.courses.find(c=>c.id === +req.params.id)

      if(!foundCourse){
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
      }
    res.json(getCourseViewModel(foundCourse))
  })

  coursesRouter.post('/', (req: RequestWithBody<CreateCourseModel>,
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

  coursesRouter.delete('/:id', (req: RequestWithParams<UriParamsCourseIdModel>, res) => {

    db.courses = db.courses.filter(c=>c.id !== +req.params.id)

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
  })

  coursesRouter.put('/:id', (req: RequestWithParamsAndBody<UriParamsCourseIdModel, UpdateCourseModel>, res) => {

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

  return coursesRouter
}