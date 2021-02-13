import { useState } from 'react'
import styled from 'styled-components/macro'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Tab, Tabs } from '@material-ui/core'
import { PageWrapper, CatalogWrapper, LabelWrapper, TabWrapper, ItemDisplayWrapper, StyledTabs, StyledTab } from './ItemCatalog'

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

function MakeLabelWrapper () {
  return (
    <LabelWrapper>
      <div>Modifier List</div>
      <div>Modifier</div>
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

function ModifierCatalog (props) {
  const [value, setValue] = useState(props.modifierLists[0].name)

  const curModifierList = props.modifierLists.filter(modifierList =>
    modifierList.name === value)[0]

  const modifiers = props.allModifiers.filter(modifier =>
    modifier.parentListId === curModifierList.dataSourceId)

  console.log('allModifiers', props.allModifiers)
  console.log('curModifierList', curModifierList)

  console.log('modifiers', modifiers)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    console.log('value', value)
  }

  console.log('props', props)

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <CatalogWrapper>
          <MakeLabelWrapper />
          <TabWrapper>
            <StyledTabs
              orientation='vertical'
              onChange={handleChange}
              value={value}
              indicatorColor='primary'
            >
              {props.modifierLists.map(modifierList => {
                return <StyledTab label={modifierList.name} value={value} />
              })}
            </StyledTabs>
          </TabWrapper>
          <ItemDisplayWrapper>
            {props.modifierLists.map(modifierList => {
              return (
                <>
                  <TabPanel value={value} category={modifierList.name}>
                    {modifiers.map(modifier => {
                      /*
                      return (
                        <MakeCatalogItems
                          itemId={modifier.dataSourceId}
                          itemImage={modifier.image}
                          itemName={modifier.name}
                          itemPrice={modifier.price.amount}
                        />
                      )
                      */
                      return (
                        modifier.name
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

export default ModifierCatalog
