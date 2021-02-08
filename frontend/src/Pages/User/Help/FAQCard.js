import { useState } from 'react'

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

import {
  QuestionSection,
  QuestionText,
  ExpandSection,
  AnswerSection
} from './HelpPage.styles'

function FAQCard (props) {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <>
      <QuestionSection
        onClick={() => {
          setShowAnswer(!showAnswer)
        }}
        style={
          showAnswer
            ? {
                color: '#F3725B',
                borderBottom: 'none'
              }
            : {
                color: '#333333',
                borderBottom: '#5A59534D 1px solid'
              }
        }
      >
        <QuestionText> {props.question} </QuestionText>
        <ExpandSection>
          {showAnswer ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </ExpandSection>
      </QuestionSection>
      {showAnswer ? <AnswerSection>{props.answer}</AnswerSection> : null}
    </>
  )
}

export default FAQCard
