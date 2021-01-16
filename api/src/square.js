import { Client, Environment } from 'square'
import { SQUARE_ACCESS_TOKEN } from './config'
import { VendorTC } from './models/VendorModel'
import {User, Vendor} from './models'


// const squareClient = new Client({
//   environment: Environment.Sandbox,
//   accessToken: SQUARE_ACCESS_TOKEN
// })

// VendorTC.mongooseResolvers.findMany()
// const vendor = async(name) => {return await VendorTC.getResolver('findOne')}
const user = async (netid) => {return await User.findOne({ netid })}
const vendor = async (name) => {return await VendorTC.mongooseResolvers.findMany()}


vendor().then((res, err) => {
  console.log(res)
  if (err) {
    console.log(err)
  }
})





// export default squareClient
