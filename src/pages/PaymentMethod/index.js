import React from 'react'
import {
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from './PaymentForm'

const PaymentMethod = () => {
    const stripePromise = loadStripe("pk_test_51M3zUWBCCU9427w3ILAFRf5hD5yzMt7TLWefz2L8TM5BQuLcgMq8zmr3GDqMbmVNFVnCQBdLQeJvoggoxUF96jIN00Bd8XPpof");
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
}

export default PaymentMethod