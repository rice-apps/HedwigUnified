/* eslint-disable no-multi-str */
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
  FAQHeader,
  SubHeader
} from './HelpPage.styles'

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
        
        {'FAQ'}
      </HelpHeader>

      <FAQSection>
        <SubHeader> {'Catalog Management'} </SubHeader>

        {CatalogFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
        ))}

        <SubHeader> {'Order Management'} </SubHeader>

        {OrderFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
        ))}

        <SubHeader> {'Store Management'} </SubHeader>

        {StoreFAQ.map(faq => (
          <FAQCard 
            question={faq.question}
            answer={faq.answer}
          />
        ))}

      </FAQSection>
    </>
  )
}

export default HelpPage
