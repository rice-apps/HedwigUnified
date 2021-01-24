import styled, { css } from 'styled-components/macro'

const HelpHeader = styled.section`
  display: grid;
  grid-template-columns: 16vw 1fr 16vw;
  justify-items: center;
  align-items: center;
  height: 20vw;
  @media (min-width: 768px) {
    height: 150px;
  }
  background-color: white;
  font-family: 'Proxima Nova Semibold';
  font-size: 6vw;
  @media (min-width: 1024px) {
    font-size: 50px;
  }
`

const BackArrowSection = styled.section`
  display: grid;
  font-size: 8vw;
  @media (min-width: 768px) {
    font-size: 50px;
  }
`

const FAQSection = styled.section`
  padding: 0vh 5vw;
`

const SubHeader = styled.section`
  padding: 2vh 0vw 1vh 0vw;
  font-family: 'Proxima Nova Semibold';
  font-size: 5vw;
  @media (min-width: 768px) {
    font-size: 35px;
  }
`

const QuestionSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 5vw;
  align-items: center;
  height: auto;
  padding: 1vh 0vw;
`

const QuestionText = styled.section`
  font-family: 'Proxima Nova';
  font-size: 4.5vw;
  @media (min-width: 768px) {
    font-size: 25px;
  }
  margin-right: 4vw;
`

const ExpandSection = styled.section`
  font-size: 6vw;
  @media (min-width: 768px) {
    font-size: 35px;
  }
  margin-bottom: -0.5vh;
`

const AnswerSection = styled.section`
  height: auto;
  white-space: pre-wrap;
  font-family: 'Proxima Nova';
  color: #5A5953;
  font-size: 4vw;
  @media (min-width: 768px) {
    font-size: 20px;
  }
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
  font-family: 'Proxima Nova Semibold';
  font-size: 5vw;
  @media (min-width: 768px) {
    font-size: 35px;
  }
`

const ContactInfo = styled.section`
  font-family: 'Proxima Nova';
  font-size: 4vw;
  @media (min-width: 768px) {
    font-size: 30px;
  }
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