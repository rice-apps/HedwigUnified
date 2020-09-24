import React from 'react'
import styled from'styled-components';
import {OrderDashboardWrapper, GeneralTitleWrapper, NewOrderTitleWrapper, AcceptedOrderTitleWrapper, ReadyOrderTitleWrapper,
    NewOrderSpaceWrapper, AcceptedOrderSpaceWrapper, ReadyOrderSpaceWrapper, MakeDashboardTitle} from './DashboardComponents.js'
import OrderCard from './OrderCard.js'

function OrderDashboard() {
    return (
        <OrderDashboardWrapper>
            <NewOrderTitleWrapper><MakeDashboardTitle name="New" quantity="2"/></NewOrderTitleWrapper>
            <NewOrderSpaceWrapper></NewOrderSpaceWrapper>
            <AcceptedOrderTitleWrapper><MakeDashboardTitle name="Accepted" quantity="5"/></AcceptedOrderTitleWrapper>
            <AcceptedOrderSpaceWrapper></AcceptedOrderSpaceWrapper>
            <ReadyOrderTitleWrapper><MakeDashboardTitle name="Ready" quantity="7"/></ReadyOrderTitleWrapper>
            <ReadyOrderSpaceWrapper></ReadyOrderSpaceWrapper>
            <OrderCard orderStatus="NewOrderSpace"/>
        </OrderDashboardWrapper>
    )
}

export default OrderDashboard
