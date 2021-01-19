import twilio from 'twilio'

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from './config'

const TwilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

export default TwilioClient
