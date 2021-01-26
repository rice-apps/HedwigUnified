import { Client, Environment } from 'square'
import { Vendor } from '../models/index.js'

// const squareClient = new Client({
//   environment: Environment.Sandbox,
//   accessToken: SQUARE_ACCESS_TOKEN
// })

const squareClients = await Vendor.find()
    .exec()
    .then(res => {
      const squareClientsMap = new Map()
      res.forEach(vendor => {
        squareClientsMap.set(
          vendor.name,
          new Client({
            environment: Environment.Sandbox,
            accessToken: vendor.squareInfo.accessToken
          })
        )
      })
      return squareClientsMap
    })

export default squareClients
