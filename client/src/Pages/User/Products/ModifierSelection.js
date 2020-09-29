import React, { useContext, useEffect, useState } from "react";
import currency from "currency.js";

function ModifierSelection ({ modifierCategory }) {
    let { modifiers: options, question, description, multiSelect} = modifierCategory;
    return (
      <div className="modifier">
        <div className="heading">
          <h1>{question}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        <div className="options">
          {options.map(option => (
            <div className="optionSet">
              <label>
                {multiSelect ? (
                  <React.Fragment>
                    <input
                      type="checkbox"
                      name={question}
                      className="modifierSelect"
                      value={JSON.stringify({ option })}
                    />
                    <span className="customCheck" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <input
                      type="radio"
                      name={question}
                      className="modifierSelect"
                      value={JSON.stringify({ option })}
                    />
                    <span className="customRadio" />
  
                  </React.Fragment>
                )}
                <p>{option.name}</p>
                {option.price ? (
                  <p>
  
                    {currency(option.price.amount).format({
                      symbol: "$",
                      format: "USD"
  
                    })}
                  </p>
                ) : (
                  <p></p>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
  
    );
  };

  export default ModifierSelection