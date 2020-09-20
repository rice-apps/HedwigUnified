import React, { useContext, useEffect, useState } from "react";
import currency from "currency.js";

const VariantSelection = ({ variant }) => {
    let { question, description, options } = variant;
    return (
      <div className="variant">
        <div className="heading">
          <h1>{question}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        <div className="options">
          {options.map(option => (
            <div className="optionSet">
              <label>
                <input
                  type="radio"
                  name={question}
                  className="variantSelect"
                  value={JSON.stringify({ option })}
                />
  
                <span className="customRadio" />
                <p>{option.name}</p>
                <p>
                  {currency(option.price.amount).format({
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