import { useState } from 'react'
import { jsx } from '@emotion/react'
import { gql } from '@apollo/client'
import styled, { css } from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'

import { IoMdArrowRoundBack } from 'react-icons/io'
import { IoMdAdd } from 'react-icons/io'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import FAQCard from './FAQCard'
import {
  HelpHeader,
  BackArrowSection,
  FAQSection,
  SubHeader,
  ContactSection,
  ContactText,
  ContactInfo
} from './HelpPage.styles'

// Buyer FAQ
const VendorFAQ = [
  {
    question: 'How do I view more information about a vendor?',
    answer:
      'To view more information about a vendor, select the info icon next to the vendor’s name.'
  },
  {
    question: 'What does “Kitchen Closed” mean?',
    answer:
      '“Kitchen Closed” means that the vendor is still open but not accepting any new orders because the vendor is about to close. Orders scheduled for pickup can still be picked up at their designated time.'
  },
  {
    question: 'What does closed mean?',
    answer:
      '“Closed” means the vendor is not accepting any new orders, nor available for orders to be picked up.'
  },
  {
    question: 'How can I contact the vendor?',
    answer:
      'To contact the vendor, select the info icon next to the vendor’s name on the Home page to view which contact methods are available.'
  }
]

const CheckoutFAQ = [
  {
    question: 'How do I make modifications to an item?',
    answer:
      'Possible modifications are listed when an item is selected. Custom modifications are currently not supported.'
  },
  {
    question: 'How do I pay for my order using Tetra?',
    answer:
      'To pay for your order using Tetra, select the “Tetra” payment option on the checkout page. Your student ID number will automatically be added to your order based on the information from your Rice login.'
  },
  {
    question: 'How do I pay for my order using a credit card?',
    answer:
      'To pay for your order using a credit card, select the “Credit Card” payment option on the checkout page. Credit card payments are processed externally using Shopify. After selecting the “Credit Card” payment option, you will need to complete payment details in an external Shopify site. Your order is not complete and cannot be accepted by the vendor until you fill out the credit card information.'
  },
  {
    question:
      'Credit card only) What is the “complete payment details” button?',
    answer:
      'Credit card payments are processed externally using Shopify. The “complete payment details” button opens the external Shopify site to enter in your payment details. Please note, an order is not considered complete until the credit card information is entered.'
  },
  {
    question:
      '(Credit card only) Why do I have to enter my credit card information in a separate website?',
    answer:
      'Hedwig uses Shopify to process payments; the website you are entering your information into is Shopify’s payment portal website.'
  },
  {
    question: 'How do I pay for my order using the Cohen House Club Card?',
    answer:
      'To pay for your order using Cohen House Club Card, select the “Cohen House Club Card” payment option on the checkout page.'
  },
  {
    question: 'What happens after I submit my order?',
    answer:
      'After you submit your order, the vendor will review your order and either accept or cancel the order. You will receive an sms message notifying you whether your order has been accepted or declined.'
  },
  {
    question: 'How do I know that the store has received my order?',
    answer:
      'After you submit your order, you will receive an sms message notifying you that your order has been submitted. This does not mean your order has been accepted.'
  },
  {
    question: 'Can I cancel my order after submitting it?',
    answer:
      'Unfortunately, Hedwig currently does not support in-app cancellation of orders after they have been submitted. In order to cancel an order after placing it, contact the vendor directly by selecting the info icon next to the vendor’s name to view contact methods.'
  }
]

const PickupFAQ = [
  {
    question: 'Where can I access pickup instructions?',
    answer:
      'To access pickup instructions for a specific vendor, select the info icon next to the vendor’s name.'
  },
  {
    question: 'How do I know when my order is ready for pickup?',
    answer:
      'The vendor will send you an SMS message when your order is ready for pickup.'
  }
]

const AccountFAQ = [
  {
    question: 'Why do you need my phone number?',
    answer:
      'Your phone number is used to deliver text updates about your order. Message and data rates may apply.'
  },
  {
    question: 'How do I change my phone number?',
    answer:
      'To change your phone number, click the menu icon on the top right. Under your name, you can view and edit your phone number. To edit your phone number, select the edit icon to the right of the phone number. Enter in the new phone number and then click “Save”.'
  }
]

function HelpPage () {
  const navigate = useNavigate()

  return (
    <>
      <HelpHeader>
        <BackArrowSection>
          <IoMdArrowRoundBack onClick={() => navigate('/eat')} />
        </BackArrowSection>

        {'Help'}
      </HelpHeader>

      <FAQSection>
        <SubHeader> {'Vendor FAQ'} </SubHeader>

        {VendorFAQ.map(faq => (
          <FAQCard question={faq.question} answer={faq.answer} />
        ))}

        <SubHeader> {'Checkout FAQ'} </SubHeader>

        {CheckoutFAQ.map(faq => (
          <FAQCard question={faq.question} answer={faq.answer} />
        ))}

        <SubHeader> {'Pickup FAQ'} </SubHeader>

        {PickupFAQ.map(faq => (
          <FAQCard question={faq.question} answer={faq.answer} />
        ))}

        <SubHeader> {'Account FAQ'} </SubHeader>

        {AccountFAQ.map(faq => (
          <FAQCard question={faq.question} answer={faq.answer} />
        ))}

        <ContactSection>
          <ContactText> {'Contact Us:'} </ContactText>
          <ContactInfo> {'********@rice.edu'} </ContactInfo>
        </ContactSection>
      </FAQSection>
    </>
  )
}

export default HelpPage
