import styled, {keyframes} from 'styled-components/macro'

const ModalWrapper = styled.div`
background-color:pink;
width:48vh;
height:50vh;
border-radius:10px;
backdrop-filter: blur(3px) brightness(80%);
position:fixed;
right: 0;
    left: 0;
    top:25vh;
    margin-right: auto;
    margin-left: auto;
z-index:2;
`

function ItemAddedModal(props){
    return(

        <ModalWrapper>
            {props.item} added!
        </ModalWrapper>
    )




}

export default ItemAddedModal