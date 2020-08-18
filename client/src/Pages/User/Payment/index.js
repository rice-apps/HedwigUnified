import React from 'react'
import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton
} from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'

function PaymentPage (props) {
  return (
    <React.Fragment>
      <h1>Credit Card Payment</h1>

      <SquarePaymentForm
        sandbox={
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
        }
        applicationId={'HEDWIG_APPLICATION_ID'}
        locationId={props.SELLER_LOCATION_ID}
        cardNonceResponseReceived={(
          errors,
          nonce,
          _cardData,
          buyerVerificationToken
        ) => {
          if (errors) {
            props.setPaymentErrors(errors) // TODO: find a parent to pass this function from
          }

          props.setPaymentDetails({
            // TODO: find a parent to pass this function from
            nonce: nonce,
            verification: buyerVerificationToken
          })
        }}
        createVerificationDetails={() => ({
          amount: String(props.amountToCharge), // TODO: find a parent to pass this charge from
          currencyCode: String(props.currency),
          intent: 'CHARGE' // TODO: pass in buyer's contact info
        })}
      >
        <fieldset className='sq-fieldset'>
          <CreditCardNumberInput />
          <div className='sq-form-third'>
            <CreditCardExpirationDateInput />
          </div>

          <div className='sq-form-third'>
            <CreditCardPostalCodeInput />
          </div>

          <div className='sq-form-third'>
            <CreditCardCVVInput />
          </div>
        </fieldset>

        <CreditCardSubmitButton>
          Pay ${props.amountToCharge}
        </CreditCardSubmitButton>
      </SquarePaymentForm>
    </React.Fragment>
  )
}

export default PaymentPage
