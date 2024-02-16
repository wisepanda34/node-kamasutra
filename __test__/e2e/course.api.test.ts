import request from 'supertest'
import {app} from '../../src/app'
import { CreateCourseModel } from '../../src/models/CreateCourseModel'
import { UpdateCourseModel } from '../../src/models/UpdateCourseModel'
import { log } from 'console'

describe('/courses', ()=>{
  //обнуляем БД перед тестами
  beforeAll(async()=>{
    await request(app).delete('/__test__/data')
  })
  
  it('Should return 200 empty array', async()=>{
    await request(app)
    .get('/courses')
    .expect(200, []);
  })

  it('Should return 400 for not existing course', async()=>{
    await request(app)
    .get('/courses/999')
    .expect(400)
  })

  it('should not create course with incorrect input data', async()=>{
    const data: CreateCourseModel = {title: ''}

    await request(app)
    .post('/courses')
    .send(data)
    .expect(400)

    await request(app)
    .get('/courses')
    .expect(200, []);
  } )

  let createdCourse: any = null
  it('should create course with correct input data', async()=>{

    const data: CreateCourseModel = {title: 'it-incubator'}

    const createResponse = await request(app)
      .post('/courses')
      .send(data)
      .expect(201)
    
    createdCourse = createResponse.body
    console.log('createdCourse: ',createdCourse)
    expect(createdCourse).toEqual({
      id: expect.any(Number),
      title: data.title
    })

    await request(app)
    .get('/courses')
    .expect(200, [createdCourse]);
  })

  it('should not update course with incorrect input data', async()=>{
    const data: UpdateCourseModel = {title: ''}
    await request(app)
      .put('/courses/' + createdCourse.id)
      .send(data)
      .expect(400)

      await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(200, createdCourse);
  })

  it('should not update course that not exist', async()=>{
    await request(app)
      .put('/courses/' + -100)
      .send({title: 'good title'})
      .expect(404)
  })

  it('should update course with correct input data', async()=>{
    const data: UpdateCourseModel = {title: 'good new title'}
    await request(app)
      .put('/courses/' + createdCourse.id)
      .send(data)
      .expect(204); 
  
    let updateCourse = {
      ...createdCourse, 
        title: data.title
    }
    await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(200, updateCourse);
      console.log('updateCourse: ', updateCourse);  
  })
})