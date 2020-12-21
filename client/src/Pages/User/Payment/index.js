import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton
} from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'

// This is credit card payment! screen

function PaymentPage (props) {
  return (
    <>
      <h1>Credit Card Payment</h1>

      <SquarePaymentForm
        sandbox={
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
        }
        applicationId='sandbox-sq0idb-uulHV5znTofKYc-U1nJBuQ'
        locationId='ZETW20E2NB4EG'
        cardNonceResponseReceived={(
          errors,
          nonce,
          _cardData,
          buyerVerificationToken
        ) => {
          if (errors) {
            alert(errors) // TODO: find a parent to pass this function from
          }

          alert(nonce)
        }}
        createVerificationDetails={() => ({
          amount: String('2800'), // TODO: find a parent to pass this charge from
          currencyCode: String('USD'),
          intent: 'CHARGE', // TODO: pass in buyer's contact info,
          billingContact: {
            postalCode: '75036'
          }
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

        <CreditCardSubmitButton>Pay $28.00</CreditCardSubmitButton>
      </SquarePaymentForm>
    </>
  )
}

export default PaymentPage
