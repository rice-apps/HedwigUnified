import { Client, Environment } from 'square'
import { SQUARE_ACCESS_TOKEN } from './config'
import { Vendor } from './models'


const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: SQUARE_ACCESS_TOKEN
})

const squareClients = new Promise((resolve,reject) => {
    Vendor.find()
    .exec()
    .then(res => {
      resolve(res.map(vendor => {
        let newClient = new Client({environment: Environment.Sandbox,accessToken: vendor.squareInfo.accessToken})
        let slug = vendor.slug
        return {"slug":slug, "client":newClient}
    }))
  })
    .catch((error) => {
        reject(error)
    });
});


export default squareClients
