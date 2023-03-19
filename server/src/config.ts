import * as dotenv from 'dotenv'
dotenv.config()

export const  Enviroment = {
  DATABASE: process.env.DATABASE as string,
  PORT: process.env.PORT || 3000,
  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
}