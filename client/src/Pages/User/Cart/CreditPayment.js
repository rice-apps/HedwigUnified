import React, { Component, useState } from "react";
import Iframe from 'react-iframe'

// Embed shopify url
function CreditPayment() {
    return (
        <div>

            {console.log(localStorage.getItem("url"))}

            <Iframe url={localStorage.getItem("url")}
                position="absolute"
                width="100%"
                id="myId"
                className="myClassname"
                height="100%"
                styles={{ height: "25px" }} />
        </div>
    )
}

export default CreditPayment;