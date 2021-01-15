import react from 'react';
import styled from 'styled-components'

const MainDiv = styled.div`
    max-width: 100%;
    max-height: 100%;
    text-align: center;
    align-items: center;
    justify-items: center;
`

const HeadPhoto = styled.img`
    position: relative;
    border-radius: 50%;
    max-height: 70%;
    max-width: 80%;
`

const Name = styled.p`
    font-weight: bold;
    margin: 0;
    margin-top: 8%;
    padding: 0;
    line-height: 90%;  
`

const Position = styled.p`
    margin: 0;
    padding: 0;
`

const HeadShot = ({src, name, position}) => {

    return(
        <MainDiv>
            <HeadPhoto src={src}/>
            <Name>{name}</Name>
            <Position>{position}</Position>
        </MainDiv>
    );

}

export default HeadShot;