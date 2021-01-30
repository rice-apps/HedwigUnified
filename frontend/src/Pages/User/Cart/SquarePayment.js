import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import { CREATE_PAYMENT } from './util';
import { useNavigate } from 'react-router-dom'
import {
  SquarePaymentForm,
  ApplePayButton,
  CreditCardCVVInput,
  CreditCardExpirationDateInput,
  CreditCardNumberInput,
  CreditCardPostalCodeInput,
  CreditCardSubmitButton,
  GooglePayButton,
  MasterpassButton,
} from 'react-square-payment-form';
import 'react-square-payment-form/lib/default.css';

// get these two id's from backend
const APPLICATION_ID = 'REPLACE-ME';
const LOCATION_ID = 'REPLACE-ME';


const SquarePayment = () => {
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();
  const [
    createPayment,
    { loading: payment_loading, error: payment_error }
  ] = useMutation(CREATE_PAYMENT)
  if (payment_loading) return <p>Creating new payment. Please wait ...</p>
  if (payment_error) {
    return <p>{payment_error.message}</p>
  }
  
  
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  const order = JSON.parse(localStorage.getItem("order"));
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  async function cardNonceResponseReceived(errors, nonce, cardData, buyerVerificationToken) {
    if (errors) {
      setErrorMessages(errors.map(error => error.message));
      return;
    }

    setErrorMessages([]);

    // alert('nonce created: ' + nonce + ', buyerVerificationToken: ' + buyerVerificationToken);
    console.log(order)
    console.log(nonce)
    console.log(buyerVerificationToken)
    alert("wait")
    const createPaymentResponse = await createPayment({
        variables: {
          source: 'SQUARE',
          sourceId: nonce,
          orderId: order.orderId,
          location: order.vendor.locationIds[0],
          subtotal: JSON.stringify(parseInt(order.subtotal) * 100),
          currency: 'USD',
        //   token: buyerVerificationToken
        }
    }).catch(error =>{ 
        console.log("create payment not working");
        console.log(error);
    })
    console.log(createPaymentResponse);
    console.log('payment created as above');
    // TO DO: check if payment is successfully created   
    navigate('/eat/confirmation');
}

  function createPaymentRequest() {
    return {
      requestShippingAddress: false,
      requestBillingInfo: true,
      currencyCode: 'USD',
      countryCode: 'US',
      total: {
        label: order.vendor.name,
        amount: JSON.stringify(parseInt(order.subtotal) * 100),
        pending: false,
      },
      lineItems: cartItems
    };
  }

  function createVerificationDetails() {
      return {
      amount: JSON.stringify(parseInt(order.subtotal) * 100),
      currencyCode: 'USD',
      intent: 'CHARGE',
      billingContact: {
        familyName: userProfile.name.split(" ")[0],
        givenName: userProfile.name.split(" ")[1],
        country: 'US',
        city: 'Houston',
        phone: userProfile.phone
      },
    };
  }

  function postalCode() {
    const postalCode = '12345'; // your logic here
    return postalCode;
  }

  function focusField() {
    return 'cardNumber';
  }

  const loadingView = <div className="sq-wallet-loading"></div>;
  const unavailableApple = (
    <div className="sq-wallet-unavailable">Apple pay unavailable. Open safari on desktop or mobile to use.</div>
  );
  const unavailableGoogle = <div className="sq-wallet-unavailable">Google pay unavailable.</div>;
  const unavailableMasterpass = <div className="sq-wallet-unavailable">Masterpass unavailable.</div>;

  return (
    <SquarePaymentForm
      sandbox={true}
      applicationId={"sandbox-sq0idb-hBUTdIbzD347gzqVsdgIyw"}
      locationId= {"LBBZPB7F5A100"}
      cardNonceResponseReceived={cardNonceResponseReceived}
      createPaymentRequest={createPaymentRequest} //Invoked when a digital wallet payment button is clicked.
      createVerificationDetails={createVerificationDetails}
      postalCode={postalCode}
      focusField={focusField}
    >
      <ApplePayButton loadingView={loadingView} unavailableView={unavailableApple} />
      <GooglePayButton loadingView={loadingView} unavailableView={unavailableGoogle} />
      <MasterpassButton loadingView={loadingView} unavailableView={unavailableMasterpass} />

      <div className="sq-divider">
        <span className="sq-divider-label">Or</span>
        <hr className="sq-divider-hr" />
      </div>

      <fieldset className="sq-fieldset">
        <CreditCardNumberInput />

        <div className="sq-form-third">
          <CreditCardExpirationDateInput />
        </div>

        <div className="sq-form-third">
          <CreditCardPostalCodeInput />
        </div>

        <div className="sq-form-third">
          <CreditCardCVVInput />
        </div>
      </fieldset>

      <CreditCardSubmitButton>Submit Payment</CreditCardSubmitButton>

      <div className="sq-error-message">
        {errorMessages.map(errorMessage => (
          <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
        ))}
      </div>
    </SquarePaymentForm>
  );
};

export default SquarePayment;
