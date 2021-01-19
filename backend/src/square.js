import { Client, Environment } from 'square'
import { SQUARE_ACCESS_TOKEN } from './config'

const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: SQUARE_ACCESS_TOKEN
})

export default squareClient
