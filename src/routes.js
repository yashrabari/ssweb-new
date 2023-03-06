import React from "react"
import { twoFactorImg, twoFactorPasswordImg } from "./assets/images"
import Payment from "./pages/Subscriptions/Payment"
import {
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SendEmail from "./pages/SendEmail";
import FAQ from "./pages/FAQ/Index";
import HowItWorks from "./pages/HowItWorks/Index";
import Products from "./pages/Products/Index";
import ContactUs from "./pages/ContactUs/ContactUs";
import Shared from "./pages/Shared";
const CreateProfile = React.lazy(() => import("./pages/CreateProfile"))
const Home = React.lazy(() => import("./pages/Layout/pages/Home"))
const Welcome = React.lazy(() => import("./pages/Welcome"))
const Login = React.lazy(() => import("./pages/Login"))
const ChangePassword = React.lazy(() => import("./pages/ChangePassword"))
const Signup = React.lazy(() => import("./pages/Signup"))
const VerifyCode = React.lazy(() => import("./pages/VerifyCode"))
const Layout = React.lazy(() => import("./pages/Layout"))
const MyBuddies = React.lazy(() => import("./pages/Layout/pages/MyBuddies"))
const Documents = React.lazy(() => import("./pages/Layout/pages/Documents"))
const About = React.lazy(() => import("./pages/Layout/pages/About"))
const Subscriptions = React.lazy(() => import("./pages/Subscriptions"))
const Landing = React.lazy(() => import("./pages/Landing"))
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"))
const TermsConditions = React.lazy(() => import("./pages/Terms&Conditions"))
const Notifications = React.lazy(() => import("./pages/Notifications"))
const TransactionsPaymentHistory = React.lazy(() => import("./pages/TransactionsPaymentHistory"))
const Transactions = React.lazy(() => import("./pages/Transactions"))
const EditProfile = React.lazy(() => import("./pages/EditProfile/EditProfile"))
const PaymentMethod = React.lazy(() => import("./pages/PaymentMethod"))
const Folder = React.lazy(() => import("./pages/Folder"))
const SendFeedback = React.lazy(() => import("./pages/SendFeedback"))
const stripePromise = loadStripe("pk_test_51M3zUWBCCU9427w3ILAFRf5hD5yzMt7TLWefz2L8TM5BQuLcgMq8zmr3GDqMbmVNFVnCQBdLQeJvoggoxUF96jIN00Bd8XPpof");

const routes = [
  {
    path: "/",
    exact: true,
    element: <Landing />
  },
  {
    path: "/welcome",
    element: <Welcome />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/home",
    element: <Layout />,
    routes: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "my-buddies",
        element: <MyBuddies />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "documents",
        element: <Documents />
      },
      {
        path: "shared",
        element: <Shared />
      },
      {
        path: "documents/folder/:id",
        element: <Folder />
      },
      {
        path: "notifications",
        element: <Notifications />
      },
      {
        path: "transactions/payment-history",
        element: <TransactionsPaymentHistory />
      },
      {
        path: "transactions",
        element: <Transactions />
      },
      {
        path: "transactions/addPaymentMethod",
        element: <PaymentMethod />
      },
      {
        path: "send/feedback",
        element: <SendFeedback />
      },
      // {
      //   path: "/transactions/subscriptions",
      //   element: <Subscriptions />
      // },
      {
        path: "edit-profile",
        element: <EditProfile />
      },
    ]
  },
  {
    path: "/2fa",
    element: (
      <VerifyCode twofactor={true} title="Two-Factor Authentication" imageSrc={twoFactorImg} />
    )
  },
  {
    path: "/send-email",
    element: (
      <SendEmail />
    )
  },
  {
    path: "/verify-forgot-password",
    element: (
      <VerifyCode twofactor={false} title="Forgot Password" imageSrc={twoFactorPasswordImg} />
    )
  },
  {
    path: "/change-password",
    element: <ChangePassword />
  },
  {
    path: "/create-profile",
    element: <CreateProfile />
  },
  {
    path: "/subscriptions",
    routes: [
      {
        index: true,
        element: <Subscriptions />
      },
      {
        path: "payment",
        element: <Elements stripe={stripePromise}><Payment /></Elements>
      }
    ]
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms-&-conditions",
    element: <TermsConditions />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/faq",
    element: <FAQ />
  },
  {
    path: "/contact-us",
    element: <ContactUs />
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />
  },
  {
    path: "/products",
    element: <Products />
  },
 
]

export default routes
