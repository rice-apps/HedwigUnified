// import { Switch, Route, Redirect } from 'react-router'
import { Route, useRoutes, useNavigate, Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import Login from '../Pages/Login'
import Auth from '../Pages/Auth'
import SignUp from '../Pages/SignUp'
import Profile from '../Pages/User/Profile'
import { Confirmation } from '../Pages/User/Confirmation'
// Vendor imports
// import VendorSettings from '../Pages/Vendor/Settings';
import VendorList from '../Pages/User/Vendors/VendorList'
// import VendorDetail from "../Pages/User/Vendors/VendorDetail";
// import ProductDetail from "../Pages/User/Products/ProductDetail";
import AlmostThere from '../Pages/User/AlmostThere'
import CartDetail from '../Pages/User/Cart'
import SquarePayment from '../Pages/User/Cart/SquarePayment'
import ContactForm from '../Pages/User/Contact'
import Menu from '../Pages/User/Menu'
import ErrorPage from './ErrorPage'
import Product from '../Pages/User/Products/Product'
import ClosedOrdersPage from '../Pages/Vendor/VendorPages/ClosedOrdersPage.js'
import OpenOrdersPage from '../Pages/Vendor/VendorPages/OpenOrdersPage.js'
import ItemsMenuManagementPage from '../Pages/Vendor/VendorPages/ItemsMenuManagementPage.js'
import ModifiersMenuManagementPage from '../Pages/Vendor/VendorPages/ModifiersMenuManagementPage.js'
import SetBasicInfoPage from '../Pages/Vendor/VendorPages/SetBasicInfoPage.js'
import SetStoreHoursPage from '../Pages/Vendor/VendorPages/SetStoreHoursPage.js'
import VendorSelect from '../Pages/Login/VendorCheck'
import gql from 'graphql-tag.macro'
import FAQ from '../Pages/Vendor/VendorPages/FAQ/index'
import AboutUs from '../Pages/User/AboutUs'
import HelpPage from '../Pages/User/Help'
import TestPage from './TestPage'
import { SmallLoadingPage } from './LoadingComponents'
import Launch from './../Pages/User/Launch'
import Onboard from './../Pages/Onboard/Onboard'
import ReturnOnboard from './../Pages/Onboard/ReturnOnboard'
/**
 * Requests to verify the user's token on the backend
 */
const VERIFY_USER = gql`
  query VerifyUser($token: String!) {
    verifyUser(idToken: $token) {
      _id
      __typename
      name
      netid
      phone
      vendor
      recentUpdate
    }
  }
`

const GET_VENDOR_DATA = gql`
  query GET_AVAILABILITY($name: String!) {
    getVendor(filter: { name: $name }) {
      name
      isOpen
      logoUrl
      allowedNetid
      _id
    }
  }
`

/**
 * Defines a private route - if the user is NOT logged in or has an invalid token,
 * then we redirect them to the login page.
 */
const PrivateRoute = ({ element, isEmployeeRoute, ...rest }) => {
  const navigate = useNavigate()

  const token =
    localStorage.getItem('token') != null ? localStorage.getItem('token') : ''

  console.log(token)

  // Verify that the token is valid on the backend
  const { data, loading, error } = useQuery(VERIFY_USER, {
    variables: { token: token },
    errorPolicy: 'none'
  })

  // Show loading message as query runs
  if (loading) {
    return <SmallLoadingPage />
  }

  // Something went wrong, try to login again
  if (error) {
    localStorage.removeItem('token')
    // Redirect to login
    navigate('/login')
  }

  // Data is missing, try to login again
  if (!data || !data.verifyUser) {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // Not employee route, redirect without checks
  if (!isEmployeeRoute) {
    return <Route {...rest} element={element} />
  }

  const vendor = data.verifyUser.vendor[0];
  const netid = data.verifyUser.netid

  // Not a vendor and already verified, go to buyer side
  if (!vendor) {
    navigate('/eat')
  }

  return (
    <EmployeeRoute netid={netid} vendor={vendor} element={element} {...rest} />
  )
}

const EmployeeRoute = ({ vendor, netid, element, ...rest }) => {
  const navigate = useNavigate()
  const { data: vendorData, loading: vendorLoad, error: vendorErr } = useQuery(
    GET_VENDOR_DATA,
    {
      variables: { name: vendor }
    }
  )

  // this isn't an employee because we have no vendor name
  if (vendorErr) {
    console.log('vendor', vendorData)
    navigate('/eat')
  }

  if (vendorLoad) {
    return <p>Waiting...</p>
  }

  const allowedUsers = vendorData.getVendor.allowedNetid
  // have to modify this with /contact
  if (!allowedUsers.includes(netid)) {
    navigate('/eat')
  }

  // this is a true employee
  return <Route {...rest} element={element} />
}

/**
 * Defines all the routes for our system.
 */
export const RoutesComponent = () => {
  const newRoutesArray = [
    {
      path: '/',
      element: <Navigate to='/eat' />
    },
    {
      path: '/onboard',
      element: <Onboard />
    },
    {
      path: '/receive',
      element: <ReturnOnboard />
    },
    {
      path: '/test',
      element: <TestPage />
    },
    {
      path: '/404_page',
      element: <ErrorPage />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/auth',
      element: <Auth />
    },
    {
      path: '/help',
      element: <HelpPage />
    },
    {
      path: '/launch',
      element: <Launch />
    },
    {
      path: '/about_us',
      element: <AboutUs />
    },
    {
      path: '/signup',
      element: <PrivateRoute element={<SignUp />} />
    },
    {
      path: '/vendor_choice',
      element: <PrivateRoute element={<VendorSelect />} />
    },
    {
      path: '/eat/*',
      children: [
        {
          path: '/',
          element: <PrivateRoute element={<VendorList />} />
        },
        {
          path: '/cart',
          element: <PrivateRoute element={<CartDetail />} />
        },
        {
          path: '/profile',
          element: <PrivateRoute element={<Profile />} />
        },
        { path: '/almostThere', element: <AlmostThere /> },
        {
          path: '/confirmation',
          element: <PrivateRoute element={<Confirmation />} />
        },
        {
          path: '/square',
          element: <PrivateRoute element={<SquarePayment />} />
        },
        {
          path: '/:vendor/*',
          children: [
            {
              path: '/',
              element: <PrivateRoute element={<Menu />} />
            },
            {
              path: '/:product',
              element: <PrivateRoute element={<Product />} />
            }
          ]
        }
      ]
    },
    {
      path: '/contact',
      element: <ContactForm />
    },
    {
      path: '/employee/*',
      children: [
        {
          path: '/',
          element: <PrivateRoute isEmployeeRoute element={<OpenOrdersPage />} />
        },
        {
          path: '/openorders',
          element: <PrivateRoute isEmployeeRoute element={<OpenOrdersPage />} />
        },
        {
          path: '/closedorders',
          element: (
            <PrivateRoute isEmployeeRoute element={<ClosedOrdersPage />} />
          )
        },
        {
          path: '/items',
          element: (
            <PrivateRoute
              isEmployeeRoute
              element={<ItemsMenuManagementPage />}
            />
          )
        },
        {
          path: '/modifiers',
          element: (
            <PrivateRoute
              isEmployeeRoute
              element={<ModifiersMenuManagementPage />}
            />
          )
        },
        {
          path: '/set-basic-info',
          element: (
            <PrivateRoute isEmployeeRoute element={<SetBasicInfoPage />} />
          )
        },
        {
          path: '/set-store-hours',
          element: (
            <PrivateRoute isEmployeeRoute element={<SetStoreHoursPage />} />
          )
        },
        {
          path: '/faq',
          element: <PrivateRoute isEmployeeRoute element={<FAQ />} />
        }
      ]
    },
    {
      path: '/*',
      element: <Navigate to='/404_page' />
    }
  ]

  const newRoutes = useRoutes(newRoutesArray)
  return newRoutes
}
