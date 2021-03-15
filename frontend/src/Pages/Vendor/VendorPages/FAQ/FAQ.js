import Collapsible from 'react-collapsible'
import styled from 'styled-components/macro'
import { FiPlus, FiMinus } from 'react-icons/fi'
import Divider from '@material-ui/core/Divider'

const QuestionWrapper = styled.div`
  color: #db6142;
  width: 100%;
  padding: 0.5vh 0.5vw;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px, 0px;
  justify-content: space-between;
  font-family: 'avenirmedium', sans-serif;
  font-size: 2vh;
  text-align: left;
`

function Question (props) {
  // Make IsExpanded prop true when the menu item is expanded by the user
  return (
    <QuestionWrapper>
      {props.question}
      {props.IsClosed ? (
        <FiPlus
          style={{
            color: '#DB6142',
            marginTop: '3px'
          }}
        />
      ) : (
        <FiMinus style={{ color: '#DB6142', marginTop: '3px' }} />
      )}
    </QuestionWrapper>
  )
}

const AnswerWrapper = styled.div`
  background-color: white;
  width: 80%;
  padding: 0.4vh 0.4vw;
  border-radius: 20px;
`
const Paragraph = styled.p`
  margin-left: 0;
  margin-top: 8px;
  margin-bottom: 0;
  text-decoration: none;
  text-align: left;
  color: #5a5953;
`

const Subparagraph = styled.div`
  margin-left: 18px;
  text-decoration: none;
  text-align: left;
  color: #5a5953;
`

function Answer (props) {
  return (
    <AnswerWrapper>
      {props.answer.map(paragraph =>
        typeof paragraph === 'string' ? (
          <Paragraph>{paragraph}</Paragraph>
        ) : (
          paragraph.map(line => <Subparagraph>{`- ${line}`}</Subparagraph>)
        )
      )}
    </AnswerWrapper>
  )
}

function FAQPage (props) {
  return (
    <div>
      <Collapsible
        closed
        trigger={<Question question={props.question} IsClosed />}
        triggerWhenOpen={
          <Question question={props.question} isClosed={false} />
        }
      >
        <Answer answer={props.answer} />
      </Collapsible>
      <Divider variant='middle' />
    </div>
  )
}

export default FAQPage
