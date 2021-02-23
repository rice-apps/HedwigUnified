import NodeVault from 'node-vault'
import { VAULT_ROOT_TOKEN, VAULT_KEYS } from '../config.js'

const vault = NodeVault({
  apiVersion: 'v1',
  endpoint: 'https://hedwig-vault.riceapps.org:8200',
  token: VAULT_ROOT_TOKEN
})

const keys = VAULT_KEYS.split(';')

await vault.unseal({ key: keys[0] })
await vault.unseal({ key: keys[1] })
await vault.unseal({ key: keys[2] })

export default vault
