// src/db/debugger.ts 

export type CourseType = {
  id: number,
  title: string,
  countStudents: number
}

export const db:DBType  = {
  courses: [
    {id:1, title: 'front-end', countStudents: 10},
    {id:2, title: 'back-end', countStudents: 12},
    {id:3, title: 'devops', countStudents: 15}
  ] 
}

export type DBType = {courses: CourseType[]}