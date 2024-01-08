import { Express, Request, Response } from 'express';

const express = require('express')
const dotenv = require('dotenv');
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!')
})

app.listen(port, (): void => {
  console.log(`Example app listening on port ${port}`)
})