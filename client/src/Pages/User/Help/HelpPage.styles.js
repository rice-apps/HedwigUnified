import styled, { css } from 'styled-components/macro'

const HelpHeader = styled.section`
  display: grid;
  grid-template-columns: 16vw 1fr 16vw;
  justify-items: center;
  align-items: center;

  height: 10vh;
  background-color: white;

  font-family: 'Avenir-black';
  font-size: 6vw;
`

const BackArrowSection = styled.section`
  display: grid;
  font-size: 8vw;
`

const FAQSection = styled.section`
  padding: 0vh 5vw;
`

const FAQHeader = styled.section`
  padding: 0vh 0vw 1vh 0vw;
  font-family: 'Avenir-black';
  font-size: 6vw;
`

const SubHeader = styled.section`
  padding: 2vh 0vw 1vh 0vw;

  font-family: 'Avenir-black';
  font-size: 5vw;
`

const QuestionSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 5vw;
  align-items: center;

  height: auto;

  padding: 1vh 0vw;
`

const QuestionText = styled.section`
  font-family: 'Avenir';
  font-size: 4.5vw;
  margin-right: 4vw;
`

const ExpandSection = styled.section`
  font-size: 6vw;
  margin-bottom: -0.5vh;
`

const AnswerSection = styled.section`
  height: auto;
  white-space: pre-wrap;

  font-family: 'Avenir';
  color: #5A5953;
  font-size: 4vw;

  padding: 0vh 0vw 1vh 0vw;
  border-bottom: #5A59534D 1px solid;
`

const ContactSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;

  align-items: center;
  padding: 5vh 0vw 3vh 0vw;
`

const ContactText = styled.section`
  font-family: 'Avenir-black';
  font-size: 5vw;
`

const ContactInfo = styled.section`
  font-family: 'Avenir';
  font-size: 4vw;

  justify-self: end;
`

export {
  HelpHeader,
  BackArrowSection,
  FAQSection,
  FAQHeader,
  SubHeader,
  QuestionSection,
  QuestionText,
  ExpandSection,
  AnswerSection,
  ContactSection,
  ContactText,
  ContactInfo
}