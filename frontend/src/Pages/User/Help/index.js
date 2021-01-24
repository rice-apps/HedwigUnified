import { useState } from 'react'
import { jsx } from '@emotion/react'
import { gql  } from '@apollo/client'
import styled, { css } from 'styled-components/macro'
import { useNavigate } from 'react-router-dom'

import { IoMdArrowRoundBack } from 'react-icons/io'
import { IoMdAdd } from 'react-icons/io'
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons'
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

/* (Vendor FAQ)
const CatalogFAQ = [
  { 
    question: 'How do I add or delete an item on the menu?', 
    answer: 'The data for the menu is in Square. To add or delete an item on the menu, please login to the Square account and make the changes there.' 
  },
  { 
    question: 'How do I change an item’s modifiers?', 
    answer: 'Modifier information is stored in Square. To edit, add, or remove modifiers for an item, please login to the Square account and make the changes there.' 
  },
  { 
    question: 'How do I change an item’s variants?', 
    answer: 'Variant information is stored in Square. To edit, add, or remove variants for an item, please login to the Square account and make the changes there.' 
  }
]
const OrderFAQ = [
  { 
    question: 'How do I accept an order paid in Tetra?', 
    answer:`To accept an order paid in Tetra: 
    \n1. Select “View Payment Details” to view the student ID. 
    \n2. Enter the student ID and amount to charge into the Tetra reader. 
    \n3. If the transaction is successful: 
    \ta. Click “Accept Order” on Hedwig. 
    \tb. Find the newly accepted order and enter the order information into Revention to generate a ticket. 
    \n4. If the transaction is unsuccessful: 
    \ta. Click “Cancel Order” on Hedwig. 
    \tb. If you wish to contact the buyer explaining why the order was cancelled, you can view buyer information by clicking the dropdown near their name at the top of an order card.`
  },
  { 
    question: 'How do I accept an order paid in a Credit Card?', 
    answer: `Credit card transactions are processed by Shopify, which means the buyer will need to enter in their credit card information in a separate site for payment processing. This means the buyer may need a few more minutes after submitting the order to enter in their credit card information. 
      \nTo accept an order paid in credit card: 
      \n1. Select “View Payment Details” to view whether the transaction had been completed. 
      \n2. If the transaction is complete, you will see a “verified” status. Then you can accept or cancel the order. 
      \n3. If the translation is incomplete, you will see the option to “Return to Home” or Cancel the order. We suggest waiting for at least 10 minutes before cancelling the order.`
  },
  { 
    question: '[Cohen House Only] How do I accept an order paid in Cohen House Club Card?', 
    answer: `To accept an order paid in Cohen House Club Card: 
      \n1. Select “View Payment Details” to view the Cohen House Club Card ID. 
      \n2. Enter the Club Card ID and amount to charge into the cashier. 
      \n3. If the transaction is successful: 
      \ta. Click “Accept Order” on Hedwig. 
      \tb. Find the newly accepted order and enter the order information into Revention to generate a ticket. 
      \n4. If the transaction is unsuccessful: 
      \ta. Click “Cancel Order” on Hedwig. 
      \tb. (If you wish to contact the buyer explaining why the order was cancelled, you can view buyer information by clicking the dropdown near their name at the top of an order card.)` 
  },
  { 
    question: 'How do I cancel an order?', 
    answer: 'Orders can be cancelled at any time. To cancel an order, select the “Cancel Order” option in the “New” orders column. ' 
  },
  { 
    question: 'How do I view closed orders?', 
    answer: 'To view closed orders, navigate to the “Closed Orders” page using the left hand side navigation pane. This page will show all completed and cancelled orders.' 
  },
  { 
    question: 'What happens when I accept/ready/pickup an order?', 
    answer: 'Whenever you change the status of an order, the buyer will receive a sms message notifying them of the change in status. ' 
  }
]
const StoreFAQ = [
  { 
    question: 'How do I set or delete store hours?', 
    answer: `To set or delete store hours, navigate to the “Set Store Hours” page under the “Store Status” tab on the left hand side navigation pane.
      \nTo add hours, select the “Add Store Hours” button. You can only add non-overlapping intervals.
      \nTo delete hours, select the “x” in the top right corner of the time interval you would like to delete.
      \nTo indicate the store is closed for a certain day, select the “Close” option in the first dropdown next to the day of the week.`
  },
  { 
    question: 'How do I change my store’s open status?', 
    answer: 'To close the store early, select the “Close Now” button on the middle bottom. Note: Closing the store early for a day is an irreversible action. The store will not open again for the remainder of that day. ' 
  }
]
*/

// Buyer FAQ
const VendorFAQ = [
  { 
    question: 'How do I view more information about a vendor?',
    answer: 'To view more information about a vendor, select the info icon next to the vendor’s name.'
  },
  { 
    question: 'What does “Kitchen Closed” mean?',
    answer: '“Kitchen Closed” means that the vendor is still open but not accepting any new orders because the vendor is about to close. Orders scheduled for pickup can still be picked up at their designated time.'
  },
  { 
    question: 'What does closed mean?',
    answer: '“Closed” means the vendor is not accepting any new orders, nor available for orders to be picked up.'
  },
  { 
    question: 'How can I contact the vendor?',
    answer: 'To contact the vendor, select the info icon next to the vendor’s name on the Home page to view which contact methods are available.'
  }
]

const CheckoutFAQ = [
  { 
    question: 'How do I make modifications to an item?',
    answer: 'Possible modifications are listed when an item is selected. Custom modifications are currently not supported.'
  },
  { 
    question: 'How do I pay for my order using Tetra?',
    answer: 'To pay for your order using Tetra, select the “Tetra” payment option on the checkout page. Your student ID number will automatically be added to your order based on the information from your Rice login.'
  },
  { 
    question: 'How do I pay for my order using a credit card?',
    answer: 'To pay for your order using a credit card, select the “Credit Card” payment option on the checkout page. Credit card payments are processed externally using Shopify. After selecting the “Credit Card” payment option, you will need to complete payment details in an external Shopify site. Your order is not complete and cannot be accepted by the vendor until you fill out the credit card information.'
  },
  { 
    question: 'Credit card only) What is the “complete payment details” button?',
    answer: 'Credit card payments are processed externally using Shopify. The “complete payment details” button opens the external Shopify site to enter in your payment details. Please note, an order is not considered complete until the credit card information is entered.'
  },
  { 
    question: '(Credit card only) Why do I have to enter my credit card information in a separate website?',
    answer: 'Hedwig uses Shopify to process payments; the website you are entering your information into is Shopify’s payment portal website.'
  },
  { 
    question: 'How do I pay for my order using the Cohen House Club Card?',
    answer: 'To pay for your order using Cohen House Club Card, select the “Cohen House Club Card” payment option on the checkout page.'
  },
  { 
    question: 'What happens after I submit my order?',
    answer: 'After you submit your order, the vendor will review your order and either accept or cancel the order. You will receive an sms message notifying you whether your order has been accepted or declined.'
  },
  { 
    question: 'How do I know that the store has received my order?',
    answer: 'After you submit your order, you will receive an sms message notifying you that your order has been submitted. This does not mean your order has been accepted.'
  },
  { 
    question: 'Can I cancel my order after submitting it?',
    answer: 'Unfortunately, Hedwig currently does not support in-app cancellation of orders after they have been submitted. In order to cancel an order after placing it, contact the vendor directly by selecting the info icon next to the vendor’s name to view contact methods.'
  }
]

const PickupFAQ = [
  { 
    question: 'Where can I access pickup instructions?',
    answer: 'To access pickup instructions for a specific vendor, select the info icon next to the vendor’s name.'
  },
  { 
    question: 'How do I know when my order is ready for pickup?',
    answer: 'The vendor will send you an SMS message when your order is ready for pickup.'
  }
]

const AccountFAQ = [
  { 
    question: 'Why do you need my phone number?',
    answer: 'Your phone number is used to deliver text updates about your order. Message and data rates may apply.'
  },
  { 
    question: 'How do I change my phone number?',
    answer: 'To change your phone number, click the menu icon on the top right. Under your name, you can view and edit your phone number. To edit your phone number, select the edit icon to the right of the phone number. Enter in the new phone number and then click “Save”.'
  }
]

function HelpPage () {
  const navigate = useNavigate()

  return (
    <>
      <HelpHeader>
        <BackArrowSection>
          <IoMdArrowRoundBack
            onClick={() => navigate('/eat')}
          />
        </BackArrowSection>

        {'Help'}
      </HelpHeader>

      <FAQSection>
        <SubHeader> {'Vendor FAQ'} </SubHeader>

        {VendorFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
        ))}

        <SubHeader> {'Checkout FAQ'} </SubHeader>

        {CheckoutFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
        ))}

        <SubHeader> {'Pickup FAQ'} </SubHeader>

        {PickupFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
        ))}

        <SubHeader> {'Account FAQ'} </SubHeader>

        {AccountFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
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