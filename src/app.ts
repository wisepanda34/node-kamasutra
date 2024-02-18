// src/app.ts 
import express from 'express'
import { getCoursesRoutes } from './routes/courses'
import { getTestsRoutes } from './routes/tests'
import { db } from './db/db'



const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
 
app.use('/courses', getCoursesRoutes(db))
app.use('/__test__', getTestsRoutes(db))


export { app }; 