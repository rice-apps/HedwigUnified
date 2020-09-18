import React, { useContext, useEffect, useState } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import { makeVar } from "@apollo/client";
import dispatch from "./FunctionalCart";
import { createMuiTheme } from "@material-ui/core";
import { cartItems } from "../../../apollo";
import VariantSelection from "./VariantSelection";
import QuantitySelector from "./QuantitySelector";
import ModifierSelection from "./ModifierSelection";

function Product() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let vendor = {
    slug: "EWT"
  };
  const navigate = useNavigate();

  const handleClick = () => {
    return navigate(`/eat/${vendor.slug}/cart`);
  };

  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    setQuantity(quantity - 1);
  };

  const product = {
    name: "Milk Tea",
    description:
      "A refreshing blend of tea and milk. You can choose to added fresh and chewy bobas for an adventurous taste.",
    squareID: 123456787,
    variants: [
      {
        question: "Select your size",
        options: [
          {
            name: "Medium (16oz)",
            description: "Medium-Sized Drink",
            variantID: "123",
            price: { amount: 3.5, currency: "USD" }
          },
          {
            name: "Large (20oz)",
            description: "Large-Sized Drink",
            variantID: "246",
            price: { amount: 4.0, currency: "USD" }
          }
        ]
      }
    ],
    modifiers: [
      {
        question: "Pick your free topping",
        description: "One included for free!",
        multiSelect: false,
        options: [
          {
            name: "Oreo",
            description: "Oreo cookie crubles",
            variantID: "123"
          },
          {
            name: "Lychee Jelly",
            description: "Bite-sized lychee jelly pieces",
            variantID: "123"
          },
          {
            name: "Tapioca Pearls (Boba)",
            description: "Fun, chewy balls",
            variantID: "123"
          }
        ]
      },

      {
        question: "Pick your additional topping(s)",
        description: "$0.50 for each additional topping.",
        multiSelect: true,
        options: [
          {
            name: "Oreo",
            description: "Oreo cookie crubles",
            variantID: "123",
            price: { amount: 0.5, currency: "USD" }
          },
          {
            name: "Lychee Jelly",
            description: "Bite-sized lychee jelly pieces",
            variantID: "123",
            price: { amount: 0.5, currency: "USD" }
          },
          {
            name: "Tapioca Pearls (Boba)",
            description: "Fun, chewy balls",
            variantID: "123",
            price: { amount: 0.5, currency: "USD" }
          },
          {
            name: "No additional topping",
            description: "None",
            variantID: "123"
          }
        ]
      },

      {
        question: "Choose your ice level",
        description: "",
        multiSelect: false,
        options: [
          { name: "No Ice", description: "No ice at all", variantID: "123" },
          { name: "Light Ice", description: "75% ice", variantID: "123" },
          { name: "Regular Ice", description: "100% ice", variantID: "123" },
          { name: "More Ice", description: "125% ice", variantID: "123" }
        ]
      },
      {
        question: "Choose your sugar level",
        description: "",
        multiSelect: false,
        options: [
          { name: "0% Sugar", description: "No Sugar", variantID: "123" },
          { name: "25% Sugar", description: "Light Sugar", variantID: "123" },
          { name: "50% Sugar", description: "Half Sugar", variantID: "123" },
          { name: "75% Sugar", description: "Less Sugar", variantID: "123" },
          { name: "100% Sugar", description: "Normal Sugar", variantID: "123" }
        ]
      }
    ]
  };

  function makeCartItem() {
    let itemName = product.name;
    let itemID = product.squareID;
    let variant = JSON.parse(
      document.querySelector(".variantSelect:checked").value
    );
    let variantObject = variant.option;
    let variantCost = variant.option.price.amount;

    console.log(variantCost);

    let modifierNames = [];
    var modifierCost = 0;
    var modifierList = {};
    let modifiers = document.querySelectorAll(".modifierSelect:checked");

    for (var i = 0; i < modifiers.length; i++) {
      let currentModifier = JSON.parse(modifiers[i].value);
      modifierList[i] = currentModifier.option;
      let currentModifierName = currentModifier.option.name;
      {
        currentModifier.option.price
          ? (modifierCost += currentModifier.option.price.amount)
          : (modifierCost += 0);
      }
      modifierNames.push(currentModifierName);
    }

    console.log(modifierCost);
    console.log(modifierList);

    let itemQuantity = { quantity }.quantity;
    console.log(itemQuantity);
    let totalPrice = modifierCost + variantCost;

    dispatch({
      type: "ADD_ITEM",
      item: {
        name: itemName,
        Id: Date.now(),
        variant: variantObject,
        modifiers: modifierList,
        quantity: itemQuantity,
        price: totalPrice,
        modDisplay: modifierNames
      }
    });

    console.log(cartItems());
  }

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
        {product.variants.map(variant => {
          return <VariantSelection variant={variant} />;
        })}
      </div>
      <div className="modifiersContainer">
        {product.modifiers.map(modifier => {
          return <ModifierSelection modifier={modifier} />;
        })}
      </div>
      <div className="quantityContainer">
        <QuantitySelector
          quantity={quantity}
          increase={increase}
          decrease={decrease}
        />
      </div>
      <div className="submitContainer">
        <button
          className="submitButton"
          onClick={() => {
            handleClick();
            makeCartItem();
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default Product;
