import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Tab, Box, Tabs, Typography, AppBar } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MakeCatalogItems from "./CatalogDisplayComponents.js";
import souppic from "./../../../../images/soup.jpg";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EA907A"
    },
    secondary: {
      main: "#F3DAC2"
    }
  },
  typography: {
    fontFamily: "Futura"
  }
});
const PageWrapper = styled.div`
  background-color: #F7f7f7;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CatalogWrapper = styled.div`
  display: grid;
  border-radius: 7px;
  height: 85%;
  width: 90%;
  margin-bottom: 20px;
  overflow: hidden;
  border-bottom: 8px #6b6b6b solid;
  grid-template-columns: 3fr 12fr;
  grid-template-rows: 45px auto;
  grid-template-areas:
    "LabelSpace LabelSpace"
    "TabSpace ItemDisplaySpace";
`;

const LabelWrapper = styled.div`
  background-color: #6b6b6b;
  width: 100%;
  height: 100%;
  grid-area: LabelSpace;
  display: grid;
  grid-template-columns: 3fr 7fr 2.25fr 3fr;
  grid-template-rows: 1fr;
  grid-template-areas: "CategoryLabelSpace ItemLabelSpace AvailablityLabelSpace PriceLabelSpace";
  font-size: 23px;
  color: white;
  align-items: center;
`;

const TabWrapper = styled.div`
  background-color: #d7d7d7;
  width: 100%;
  height: 100%;
  grid-area: TabSpace;
`;

const ItemDisplayWrapper = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  grid-area: ItemDisplaySpace;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  overflow-y: auto;
  overflow-x: hidden;
`;

function MakeLabelWrapper() {
  return (
    <LabelWrapper>
      <div>Category</div>
      <div>Item</div>
      <div>Availability</div>
      <div>Price</div>
    </LabelWrapper>
  );
}

const StyledTabs = styled(Tabs)`
  && {
    background-color: #7b7b7b;
    width: 100%;
    color: black;
  }
`;

const StyledTab = styled(Tab)`
  && {
    background-color: white;
    font-weight: 700;
    width: 100%;
  }
`;

function TabPanel(props) {
  const { children, value, category, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== category}
      id={`vertical-tabpanel-${category}`}
      {...other}
    >
      {value === category && <div>{children}</div>}
    </div>
  );
}

function ItemCatalog() {
  const [value, setValue] = useState("soup");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <CatalogWrapper>
          <MakeLabelWrapper />
          <TabWrapper>
            <StyledTabs
              orientation="vertical"
              onChange={handleChange}
              value={value}
              indicatorColor="primary"
            >
              <StyledTab label="Daily Soup" value="soup" />
              <StyledTab label="Grill" value="grill" />
              <StyledTab label="Salads" value="salads" />
              <StyledTab label="Cold Sandwiches" value="cold-sandwiches" />
              <StyledTab label="Taco" value="taco" />
              <StyledTab label="Curbside Coffee" value="curbside-coffee" />
              <StyledTab label="Beverages" value="beverages" />
              <StyledTab label="Desserts" value="desserts" />
            </StyledTabs>
          </TabWrapper>
          <ItemDisplayWrapper>
            <TabPanel value={value} category={"soup"}>
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Creamy Tomato Bisque"
                itemPrice="3.50"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Chicken Noodle Soup"
                itemPrice="4.50"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Black Bean Soup (with Pico, Crema and Cilantro)"
                itemPrice="3.50"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Hearty Beef and Rice"
                itemPrice="3.50"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="French Onion Soup"
                itemPrice="4.00"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Egg Drop Soup"
                itemPrice="3.25"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Seafood Gumbo"
                itemPrice="3.50"
              />
              <MakeCatalogItems
                itemImage={souppic}
                itemName="Broccoli Cheddar Soup"
                itemPrice="3.50"
              />
            </TabPanel>
            <TabPanel value={value} category={"grill"}>
              Grill
            </TabPanel>
            <TabPanel value={value} category={"salads"}>
              Salads
            </TabPanel>
            <TabPanel value={value} category={"cold-sandwiches"}>
              Cold Sandwiches
            </TabPanel>
            <TabPanel value={value} category={"taco"}>
              Taco
            </TabPanel>
            <TabPanel value={value} category={"curbside-coffee"}>
              Curbside Coffee
            </TabPanel>
            <TabPanel value={value} category={"beverages"}>
              Beverages
            </TabPanel>
            <TabPanel value={value} category={"desserts"}>
              Desserts
            </TabPanel>
          </ItemDisplayWrapper>
        </CatalogWrapper>
      </PageWrapper>
    </ThemeProvider>
  );
}

export default ItemCatalog;
