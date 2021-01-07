import styled, {css} from 'styled-components'

const Div = styled.div`
${props => props.wrapper && css`
height:95%;
width:85%;
background-color:orange;
display: grid;
`}
`

function BasicInfoDashboard() {
    return(
    <Div wrapper>
Set Basic Info
    </Div>)
}


export default BasicInfoDashboard