import React, { useContext, useEffect, useState } from "react";
import currency from "currency.js";

const VariantSelection = ({ variants }) => {
    return (
      <div className="variant">
        <div className="heading">
          <h1>{variants[0].description}</h1>
          {variants[0].description ? <p>{variants[0].description}</p> : null}
        </div>
        <div className="options">
          {variants.map(option => (
            <div className="optionSet">
              <label>
                <input
                  type="radio"
                  name={option.name}
                  className="variantSelect"
                  value={JSON.stringify({ option })}
                />
  
                <span className="customRadio" />
                <p>{option.name}</p>
                <p>
                  {currency(option.price.amount/100).format({
                    symbol: "$",
                    format: "USD"
                  })}
                </p>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default VariantSelection;