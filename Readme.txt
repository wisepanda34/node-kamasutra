$ yarn init
$ yarn add  nodemon -D
$ yarn add typescript ts-node @types/express @types/node -D
$ yarn tsc --init (tsconfig.json will created.   raw 58:  "outDir": "./dist", код из index.ts будет компилироваться в dist/index.js )
$ yarn tsc -w (watch) - в одном терминале
$ yarn nodemon .\dist\index.js - в другом терминале
или написать скоипты:
 "scripts": {
    "watch": "tsc -w",
    "dev": "nodemon .\\dist\\index.js",
    "build": "tsc",
    "start": "node dist/index.js"
  }, запускать скрипты в разных терминалах

$ yarn add jest ts-jest @types/jest supertest @types/supertest
$ yarn ts-jest config:init     