// src/roytes/test
import {DBType} from '../db/db'
import express from 'express'

import {HTTP_STATUS} from '../constants/http-status'



export const getTestsRoutes = (db: DBType) => {
  const testsRouter = express.Router()

  testsRouter.delete('/data', (req,res)=>{
    db.courses = []
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
  })

  return testsRouter
}
