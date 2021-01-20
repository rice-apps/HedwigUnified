import VendorsideTemplate from './../../VendorComponents/VendorGridContainer'
import styled from 'styled-components/macro'
import FAQ from './FAQ'
import { catalog_faqs, order_faqs, store_faqs } from './faqs'
const FaqColumn = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-content: stretch;
  font-weight: 500;
  background-color: white;
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
`

const FaqPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.8vh;
`

const Header = styled.h1`
  text-align: center;
  font-size: 3.6vh;
  font-family: 'avenirbold';
`

const ColumnHeader = styled.h2`
  color: #5a5953;
  font-size: 3vh;
  font-family: 'avenirbold';
`

const FAQComp = () => (
  <Wrapper>
    <Header>Hedwig Help Center</Header>
    <FaqPanel>
      <FaqColumn>
        <ColumnHeader>Catalog Management</ColumnHeader>
        {catalog_faqs.map(faq => (
          <FAQ question={faq.question} answer={faq.answer} />
        ))}
      </FaqColumn>
      <FaqColumn>
        <ColumnHeader>Order Management</ColumnHeader>
        {order_faqs.map(faq => (
          <FAQ question={faq.question} answer={faq.answer} />
        ))}
      </FaqColumn>
      <FaqColumn>
        <ColumnHeader>Store Management</ColumnHeader>
        {store_faqs.map(faq => (
          <FAQ question={faq.question} answer={faq.answer} />
        ))}
      </FaqColumn>
    </FaqPanel>
  </Wrapper>
)

const FAQPage = () => {
  return <VendorsideTemplate page={<FAQComp />} />
}

export default FAQPage
