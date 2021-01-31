import styled from 'styled-components/macro'

const HelpHeader = styled.section`
  display: grid;
  grid-template-columns: 10vh 1fr 10vh;
  justify-items: center;
  align-items: center;
  height: 8vh;
  padding-top: 3vh;
  background-color: white;
  font-family: 'avenir';
  font-weight: bold;
  font-size: 3.5vh;
`

const BackArrowSection = styled.section`
  display: grid;
  font-size: 3.5vh;
`

const FAQSection = styled.section`
  padding: 0vh 5vw;
  font-family: 'avenir';
`

const SubHeader = styled.section`
  padding: 2vh 0vw 1vh 0vw;
  font-size: 2.8vh;
  font-weight: 600;
`

const QuestionSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 5vw;
  align-items: center;
  height: auto;
  padding: 1vh 0vw;
`

const QuestionText = styled.section`
  font-size: 2.5vh;
  line-height: 3vh;
  margin-right: 4vw;
`

const ExpandSection = styled.section`
  font-size: 3vh;
  margin-bottom: -0.5vh;
`

const AnswerSection = styled.section`
  height: auto;
  white-space: pre-wrap;
  color: #5a5953;
  font-size: 2.2vh;
  line-height: 2.6vh;
  padding: 1.2vh 0vw 2vh 0vw;
  border-bottom: #5a59534d 1px solid;
`

const ContactSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  font-size: 3vh;
  padding: 5vh 0vw 3vh 0vw;
`

const ContactText = styled.section`
  font-weight: bold;
`

const ContactInfo = styled.section`
  justify-self: end;
`

export {
  HelpHeader,
  BackArrowSection,
  FAQSection,
  SubHeader,
  QuestionSection,
  QuestionText,
  ExpandSection,
  AnswerSection,
  ContactSection,
  ContactText,
  ContactInfo
}
