import { useState } from 'react'
import styled from 'styled-components/macro'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Tab, Tabs } from '@material-ui/core'

import MakeCatalogItems from './CatalogDisplayComponents.js'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#EA907A'
    },
    secondary: {
      main: '#F3DAC2'
    }
  }
})

export const PageWrapper = styled.div`
  background-color: #f7f7f7;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CatalogWrapper = styled.div`
  display: grid;
  border-radius: 7px;
  height: 85%;
  width: 90%;
  margin-bottom: 20px;
  overflow: hidden;
  border-bottom: 8px #6b6b6b solid;
  grid-template-columns: 3fr 12fr;
  grid-template-rows: 45px auto;
  grid-template-areas:
    'LabelSpace LabelSpace'
    'TabSpace ItemDisplaySpace';
`

export const LabelWrapper = styled.div`
  background-color: #6b6b6b;
  width: 100%;
  height: 100%;
  grid-area: LabelSpace;
  display: grid;
  grid-template-columns: 3fr 7fr 2.25fr 3fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'CategoryLabelSpace ItemLabelSpace AvailablityLabelSpace PriceLabelSpace';
  font-size: 23px;
  color: white;
  align-items: center;
`

export const TabWrapper = styled.div`
  background-color: #d7d7d7;
  width: 100%;
  height: 100%;
  grid-area: TabSpace;
  overflow: scroll;
`

export const ItemDisplayWrapper = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  grid-area: ItemDisplaySpace;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const StyledTabs = styled(Tabs)`
  && {
    background-color: #7b7b7b;
    width: 100%;
    color: black;
  }
`

export const StyledTab = styled(Tab)`
  && {
    background-color: white;
    font-weight: 700;
    width: 100%;
  }
`

function MakeLabelWrapper (props) {
  return (
    <LabelWrapper>
      <div>Category</div>
      <div>{props._typename}</div>
      <div>Availability</div>
      <div>Price</div>
    </LabelWrapper>
  )
}

function TabPanel (props) {
  const { children, value, category } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== category}
      id={`vertical-tabpanel-${category}`}
    >
      {value === category && <div>{children}</div>}
    </div>
  )
}

function ItemCatalog (props) {
  const [value, setValue] = useState(props.category)

  const items = props.catalog.filter(item => item.category === value)
  const itemIds = items.map(item => item.dataSourceId)
  console.log(itemIds)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    console.log('value', value)
  }

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <CatalogWrapper>
          <MakeLabelWrapper _typename = {props.catalog[0]._typename || "Item"}/>
          <TabWrapper>
            <StyledTabs
              orientation='vertical'
              onChange={handleChange}
              value={value}
              indicatorColor='primary'
            >
              {props.categories.map(category => {
                return <StyledTab label={category} value={category} />
              })}
            </StyledTabs>
          </TabWrapper>
          <ItemDisplayWrapper>
            {props.categories.map(category => {
              return (
                <>
                  <TabPanel value={value} category={category}>
                    {items.map(item => {
                      return (
                        <MakeCatalogItems
                          itemId={item.dataSourceId}
                          itemImage={item.image}
                          itemName={item.name}
                          itemPrice={item.variants[0].price.amount}
                          itemType={props.catalog[0]._typename || "Item"}
                        />
                      )
                    })}
                  </TabPanel>
                </>
              )
            })}
          </ItemDisplayWrapper>
        </CatalogWrapper>
      </PageWrapper>
    </ThemeProvider>
  )
}

export default ItemCatalog
