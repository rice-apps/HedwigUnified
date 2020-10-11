import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router'
import { useNavigate } from 'react-router-dom'
import SideBarItems from './SideBarItems.js'

const SideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`

function MenuCategories (props) {
  return (
    <SideBarWrapper>
      <SideBarItems updateCategory={props.updateCategory} categories={props.categories}/>
    </SideBarWrapper>
  )
}

export default MenuCategories
