import React, { Component, useEffect, Profiler } from 'react'
// import { Switch, Route, Redirect } from 'react-router'
import { Routes, Route, useRoutes, Navigate } from 'react-router-dom'
import {
  gql,
  useQuery,
  useApolloClient,
  createSignalIfSupported
} from '@apollo/client'
import Login from '../Pages/Login'
import Auth from '../Pages/Auth'
import Home from '../Pages/Home'
import SignUp from '../Pages/SignUp'
import Profile from '../Pages/User/Profile'

// Vendor imports
import Orders from '../Pages/Vendor/Orders'
// import VendorSettings from '../Pages/Vendor/Settings';
import VendorList from '../Pages/User/Vendors/VendorList'
// import VendorDetail from "../Pages/User/Vendors/VendorDetail";
// import ProductDetail from "../Pages/User/Products/ProductDetail";
import CartDetail from '../Pages/User/Cart'
import OrderList from '../Pages/User/Orders'
import Menu from '../Pages/User/Menu'
import Product from '../Pages/User/Products/Product'

/**
 * Requests to verify the user's token on the backend
 */
const VERIFY_USER = gql`
  query VerifyQuery($token: String!) {
    verifyUser(token: $token) {
      _id
      __typename
      name
      netid
      phone
      token
      recentUpdate
    }
  }
`

/**
 * This simply fetches from our cache whether a recent update has occurred
 */
const GET_USER_INFO = gql`
  query GetUserInfo {
    user @client {
      _id
      recentUpdate
      firstName
      lastName
      netid
      phone
    }
  }
`

/**
 * Defines a private route - if the user is NOT logged in or has an invalid token,
 * then we redirect them to the login page.
 */
const PrivateRoute = ({ element, ...rest }) => {
  let token =
    localStorage.getItem('token') != null ? localStorage.getItem('token') : ''

  let client = useApolloClient()

  // Verify that the token is valid on the backend
  let { data, loading, error } = useQuery(VERIFY_USER, {
    variables: { token: token },
    errorPolicy: 'none'
  })

  if (error) {
    // Clear the token because something is wrong with it
    localStorage.removeItem('token')
    // Redirect the user to the login page
    return <Navigate to='/login' />
  }
  if (loading) return <p>Waiting...</p>
  if (!data || !data.verifyUser) {
    // Clear the token
    localStorage.removeItem('token')
    // Redirect the user
    return <Navigate to='/login' />
  }

  // Check whether any recent updates have come in
  // let { _id, netid, recentUpdate } = data.verifyUser;

  // Upon verification, store the returned information
  client.writeQuery({
    query: GET_USER_INFO,
    data: { user: data.verifyUser }
  })

  // Everything looks good! Now let's send the user on their way
  return <Route {...rest} element={element} />
}

const newRoutesArray = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/signup',
    element: <PrivateRoute element={<SignUp />} />
  },
  {
    path: '/eat/*',
    children: [
      { path: '/', element: <PrivateRoute element={<VendorList />} /> },
      { path: '/profile', element: <PrivateRoute element={<Profile />} /> },
      { path: '/orders', element: <PrivateRoute element={<OrderList />} /> },
      {
        path: '/:vendor/*',
        children: [
          { path: '/', element: <PrivateRoute element={<Menu />} /> },
          {
            path: '/:product',
            element: <PrivateRoute element={<Product />} />
          },
          { path: '/cart', element: <PrivateRoute element={<CartDetail />} /> }
        ]
      }
    ]
  }
]

// const routesArray = [
//     {
//         path: "/login",
//         component: Login,
//         privateRoute: false
//     },
//     {
//         path: "/auth",
//         component: Auth,
//         privateRoute: false
//     },
//     {
//         path: "/home",
//         component: Home,
//         privateRoute: true
//     },
//     {
//         path: "/user/vendors/:slug/cart",
//         component: CartDetail,
//         privateRoute: true
//     },
//     {
//         path: "/user/vendors/:slug/products/:product",
//         component: ProductDetail,
//         privateRoute: true
//     },
//     {
//         path: "/user/vendors/:slug",
//         component: VendorDetail,
//         privateRoute: true
//     },
//     {
//         path: "/user/vendors",
//         component: VendorList,
//         privateRoute: true,
//     },
//     {
//         path: "/user/orders",
//         component: OrderList,
//         privateRoute: true,
//     },
//     {
//         path: "/vendor/orders",
//         component: Orders,
//         privateRoute: true
//     },
//     {
//         path: "/vendor/settings",
//         component: VendorSettings,
//         privateRoute: true
//     },
//     {
//         path: "/", // catch all handler, redirect to Home
//         component: Home,
//         privateRoute: true
//     },
// ];

/**
 * Defines all the routes for our system.
 * @param {*} param0
 */
export const RoutesComponent = ({}) => {
  // const client = useApolloClient();

  // Initially, we need to get the "serviceURL" (used for IDP authentication) from the backend
  // useEffect(
  //     () => {
  //         fetch(backendURL + "/deploy/service")
  //         .then(response => {
  //             response.text().then(service => {
  //                 // Directly writes the service url to the cache
  //                 client.writeQuery({
  //                     query: gql`query GetService { service }`,
  //                     data: { service: service }
  //                 });
  //             });
  //         });
  //     }, []
  // );
  const newRoutes = useRoutes(newRoutesArray)
  return newRoutes
}

//     return (
//         <Switch>
//             {/* <Route path={"/login"}>
//                 <Login />
//             </Route>
//             <Route path={"/auth"}>
//                 <Auth />
//             </Route>
//             <PrivateRoute path={"/home"}>
//                 <Home />
//             </PrivateRoute>
//             <PrivateRoute path={"/"}>
//                 <Home />
//             </PrivateRoute> */}
//             {routesArray.map(routeObject => {
//                 let { path, component, privateRoute } = routeObject;
//                 if (privateRoute) {
//                     return (<PrivateRoute path={path} component={component} />);
//                 } else {
//                 return (<Route path={path} component={component} />);
//                 }
//             })}
//         </Switch>
//     )
// }
