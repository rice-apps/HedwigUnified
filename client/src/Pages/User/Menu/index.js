import React, { useState, useEffect } from "react";
import hero from "./hero.jpg";
import boba from "./boba.jpg";
import './index.css'
import { Link, animateScroll as scroll } from "react-scroll";
import { gql, useQuery } from "@apollo/client";



const vendor = {
    name:"East West Tea",
    hours:"Monday - Thursday 7:00 pm - 10:00 pm", 
    location:"Sammy's Kitchen in Rice Memorial Center", 
    categories:["Special Offers", "Milk Tea", "Fruit Tea", "Snacks", "Burgers", "Salads", "Chicken"],
    products:[
        {name:"Nutty Bee Boba", category:"Special Offers", price:"$3.50", image:boba},
        {name:"Peach Black Tea", category:"Fruit Tea", price:"$3.50", image:boba},
        {name:"Strawberry Lemonade", category:"Fruit Tea", price:"$3.50", image:boba},
        {name:"Milk Tea", category:"Milk Tea", price:"$3.50", image:boba},
        {name:"Taro Tea", category:"Milk Tea", price:"$3.50", image:boba},
        {name:"Thai Tea", category:"Milk Tea", price:"$3.50", image:boba},
        {name:"Just Plain Boba", category:"Snacks", price:"$.50", image:boba},
        {name:"Honeydew Boba", category:"Special Offers", price:"$3.50", image:boba},
        {name:"Passionfruit Tea", category:"Fruit Tea", price:"$3.50", image:boba},
        {name:"Pink Lemonade", category:"Fruit Tea", price:"$3.50", image:boba},
        {name:"Green Tea", category:"Milk Tea", price:"$3.50", image:boba},
        {name:"Jasmine Tea", category:"Milk Tea", price:"$3.50", image:boba},
        {name:"Black Tea", category:"Milk Tea", price:"$3.50", image:boba},
        {name:"Goldfish", category:"Snacks", price:"$1.50", image:boba},
        {name:"Hamburger", category:"Burgers", price:"$7.00", image:boba},
        {name:"Cheeseburger", category:"Burgers", price:"$7.50", image:boba},
        {name:"Cobb Salad", category:"Salads", price:"$7.50", image:boba},
        {name:"Whole Chicken", category:"Chicken", price:"$8.00", image:boba},
        {name:"Chicken Nuggets", category:"Chicken", price:"$6.00", image:boba},
        ]
    }    

const Menu = () => {
const [categories, setCategories] = useState(new Set([]))
    const GET_CATALOG = gql`
    query GET_CATALOG($item: String!){
  getCatalog(dataSource:SQUARE, vendor: $item){
    name
    category
    image
    variants {
      name
      description
      price{
        amount
      }
    }
  }
}
`

    const { data: getCatalogResponse, loading, error } = useQuery(GET_CATALOG, {
    variables: {
        item:  "xoop"
    }
  })

    const parsedCategories = (catalog) => {
        for (item = 0; item<catalog.length(); item++) {
            categories.append(catalog[item].category)
        }
        return categories
    }

    useEffect(() => {
            const { getCatalog: menu } = getCatalogResponse;
            setCategories(parsedCategories(menu))
        return () => {
            
        }
    }, [getCatalogResponse])
// use effect 
// use effect depend on getCatalogResponse changing

    if (error) return <p>Error...</p>;
    if (loading) return <p>Loading...</p>;
    if (!getCatalogResponse) return <p>No data...</p>;

    const { getCatalog: menu } = getCatalogResponse;
    let item = 0
    
    console.log(categories)
    return(
        <div>
            {/* Hero Image */}
            <img src={hero} class="hero" alt="hero"/>
            
            {/* Vendor Info */}
            <div class="vendorinfocontainer">
                {/* Vendor Name */}
                <h1 class="vendortitle"> {vendor.name} </h1>
                {/* Vendor Operating Hours */}
                <p class="vendorinfo">{vendor.hours}</p>
                {/* Vendor Location */}
                <p class="vendorinfo"> {vendor.location}</p>
                <button class="readmore"> More Info </button>
            </div>

            {/* Category Select Bar */}
            <div class = "categoryselect">
                {categories.map(category => (
                    // smooth scrolling feature
                    <h1 class="categoryname">
                        <Link
                            activeClass="categoryactive" 
                            to={category} 
                            smooth={true}
                            spy={true} 
                            duration={500}
                            offset={-20}
                        >
                        {category}
                        </Link>
                    </h1>
                ))}
            </div>

            {/* Products */}
            <div class = "itemlist">
                
                {/* Appending each category to the list */}
                {categories.map(category =>
                    <div id={category}> 
                        {/* Giving each category a header */}
                        <h3 class="categoryheader">{category}</h3>
                        {/*  Filtering out all items that fall under the category */}
                        {menu.filter(item => item.category === category).map(product => (
                            <div class="itemgrid">
                                {/* Displaying the item: image, name, and price */}
                                <img src={product.image} class="itemimage" alt="boba"/>
                                <h1 class="itemname">{product.name}</h1>
                                <p class="itemprice">{product.price}</p>
                            </div>
                        ))}
                    </div>
                )}     
            </div>
        
        </div>
    )
}

export default Menu