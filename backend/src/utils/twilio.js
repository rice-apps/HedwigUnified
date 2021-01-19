import twilio from 'twilio'

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../config.js'

const TwilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

export default TwilioClient
