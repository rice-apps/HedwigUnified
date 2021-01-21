import VendorsideTemplate from './../../VendorComponents/VendorGridContainer'
import styled from 'styled-components/macro'
import FAQ from './FAQ'
import { catalog_faqs, order_faqs, store_faqs } from './faqs'
const FaqColumn = styled.div`
  display: flex;
  height: 100%;
  width: 95%;
  flex-direction: column;
  align-content: stretch;
  font-weight: 500;
  background-color: white;
  grid-area: ${props => props.gridArea};
`

const Wrapper = styled.div`
  height: 100%;
  display:grid;
  grid-template-columns:1fr ;
  grid-template-rows:10vh 1fr;
  grid-template-areas:
  "HeaderSpace "
  "FAQSpace";
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
  grid-area:FAQSpace;
  display:grid;
  grid-template-columns:0.1fr 1fr 1fr 1fr 0.1fr;
  grid-template-rows: 1fr;
  grid-template-areas:
  "empty CatalogSpace OrderSpace StoreSpace empty2";
`

const Header = styled.h1`
  text-align: center;
  margin:2vh;
  grid-area:HeaderSpace;
  font-size: 3.6vh;
  font-family: 'avenirbold';
`

const ColumnHeader = styled.h2`
  color: #5a5953;
  font-size: 3vh;
  font-family: 'avenirbold';
`

function FAQComp () {
  return (
    <Wrapper>
      <Header>Hedwig Help Center</Header>
      <FaqPanel>
        <FaqColumn gridArea='CatalogSpace'>
          <ColumnHeader>Catalog Management</ColumnHeader>
          {catalog_faqs.map(faq => (
            <FAQ question={faq.question} answer={faq.answer} />
          ))}
        </FaqColumn>
        <FaqColumn gridArea='OrderSpace'>
          <ColumnHeader>Order Management</ColumnHeader>
          {order_faqs.map(faq => (
            <FAQ question={faq.question} answer={faq.answer} />
          ))}
        </FaqColumn>
        <FaqColumn gridArea='StoreSpace'>
          <ColumnHeader>Store Management</ColumnHeader>
          {store_faqs.map(faq => (
            <FAQ question={faq.question} answer={faq.answer} />
          ))}
        </FaqColumn>
      </FaqPanel>
    </Wrapper>
  )
}

function FAQPage () {
  return <VendorsideTemplate page={<FAQComp />} />
}

export default FAQPage
