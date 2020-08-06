import React, { useContext, useEffect, useState } from "react";
import currency from "currency.js";
import "./product.css";
import { gql, useQuery } from "@apollo/client";

const GET_ITEM = gql`
  query GET_ITEM($item: String!) {
    getItem(dataSource: SQUARE, dataSourceId: $item) {
      name
      description
      variants {
        name
        description
        price {
          amount
        }
      }
      modifierLists {
        name
        selectionType
        modifiers {
          name
          price {
            amount
          }
        }
      }
    }
  }
`;


const VariantSelection = ({ variant }) => {
  let { name, description, price } = variant;
  return (
    <div className="variant">
      <div className="heading">
        <h1>{name}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="options">
          <div className="optionSet">
            <label>
              <input type="radio" name={name} />
              <span className="customRadio" />
              <p>
                {currency(price.amount / 100).format({
                  symbol: "$",
                  format: "USD",
                })}
              </p>
            </label>
          </div>
      </div>
    </div>
  );
};

const ModifierSelection = ({ modifier }) => {
  let { name, selectionType, modifiers } = modifier;
  return (
    <div className="modifier">
      <div className="heading">
        <h1>{name}</h1>
        {/* {description ? <p>{description}</p> : null} */}
      </div>
      <div className="options">
        {modifiers.map((option) => (
          <div className="optionSet">
            <label>
              {selectionType === "MULTI" ? (
                <React.Fragment>
                  <input type="checkbox" name={name} />
                  <span className="customCheck" />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <input type="radio" name={name} />
                  <span className="customRadio" />
                </React.Fragment>
              )}
              <p>{option.name}</p>
              {option.price.amount ? (
                <p>
                  {currency(option.price.amount / 100).format({
                    symbol: "$",
                    format: "USD",
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

const Product = ({}) => {
  // const product = {
  //   name: "Oreo Milk Tea",
  //   description:
  //     "Super sweet tea with the small chunks of oreos. You can choose to added fresh and chewy bobas for an adventurous taste.",
  //   variants: [
  //     {
  //       question: "Select your size",
  //       description: "",
  //       options: [
  //         { name: "Medium (16oz)", price: 3.5 },
  //         { name: "Large (20oz)", price: 4.0 },
  //       ],
  //     },
  //   ],
  //   modifiers: [
  //     {
  //       question: "Pick your topping(s)",
  //       description: "One included. $0.50 for each additional topping.",
  //       multiSelect: true,
  //       options: [
  //         { name: "Oreo" },
  //         { name: "Lychee Jelly" },
  //         { name: "Tapioca Pearls (Boba)" },
  //       ],
  //     },
  //     {
  //       question: "Choose your ice level",
  //       description: "",
  //       multiSelect: false,
  //       options: [
  //         { name: "No Ice" },
  //         { name: "Light Ice" },
  //         { name: "Regular Ice" },
  //         { name: "More Ice" },
  //       ],
  //     },
  //     {
  //       question: "Choose your sugar level",
  //       description: "",
  //       multiSelect: false,
  //       options: [
  //         { name: "0%" },
  //         { name: "25%" },
  //         { name: "50%" },
  //         { name: "75%" },
  //         { name: "100%" },
  //       ],
  //     },
  //   ],
  // };

  // Use Query here
  const { data: getItemResponse, loading, error } = useQuery(GET_ITEM, {
    variables: {
      item:  "LQQEVMMGM25I5L2B64Z6V2YO"/*TODO Add vendor name based on page here (Ask Will For Help)*/
    }
  })

  if (error) return <p>Error...</p>;
  if (loading) return <p>Loading...</p>;
  if (!getItemResponse) return <p>No data...</p>;

  // Rename getItem to product
  const { getItem: product } = getItemResponse;

  return (
    <div className="container">
      <img
        className="heroImage"
        src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"
      />
      <div className="itemHeading">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
      </div>
      <div className="variantsContainer">
        {product.variants.map((variant) => {
          return <VariantSelection variant={variant} />;
        })}
      </div>
      <div className="modifiersContainer">
        {product.modifierLists.map((modifier) => {
          return <ModifierSelection modifier={modifier} />;
        })}
      </div>
      <div className="quantityContainer">
        <button>-</button>
        <p>1</p>
        <button>+</button>
      </div>
      <div className="submitContainer">
        <button className="submitButton">Add</button>
      </div>
    </div>
  );
};

export default Product;
