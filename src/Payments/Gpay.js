import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from '@mui/material/Button';

const GooglePayButton = () => {
  const [googlePayReady, setGooglePayReady] = useState(false);

  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'your_gateway',
            gatewayMerchantId: 'your_merchant_id',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: 'your_merchant_id',
      merchantName: 'Your Merchant Name',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '10.00', // Total amount to be charged
      currencyCode: 'USD', // Currency code
    },
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => {
      // Google Pay script has loaded
      setGooglePayReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createGooglePayButton = () => {
    const googlePay = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });

    googlePay.isReadyToPay({
      allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
    }).then((response) => {
      if (response.result) {
        const button = googlePay.createButton({
          onClick: onGooglePayButtonClick,
        });
        button.style.width = '200px'; // Adjust the button width as needed
        button.style.height = '40px'; // Adjust the button height as needed
        document.getElementById('google-pay-button-container').appendChild(button);
      } else {
        console.error('Unable to pay using Google Pay:', response);
      }
    }).catch((error) => {
      console.error('Error checking Google Pay availability:', error);
    });
  };

  const onGooglePayButtonClick = () => {
    console.log('Google Pay button clicked');
    const googlePay = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
    googlePay.loadPaymentData(paymentRequest).then((paymentData) => {
      console.log('Payment successful:', paymentData);
      // Handle successful payment
    }).catch((error) => {
      console.error('Error processing payment:', error);
      // Handle payment processing error
    });
  };

  useEffect(() => {
    if (googlePayReady) {
      createGooglePayButton();
    }
  }, [googlePayReady]);

  return (
    <div>
      <Helmet>
        <script src="https://pay.google.com/gp/p/js/pay.js" async />
      </Helmet>
      {googlePayReady ? (
        <div id="google-pay-button-container">
          <Button variant="contained" color="primary" onClick={onGooglePayButtonClick}>
            Pay with Google Pay
          </Button>
        </div>
      ) : (
        <div>Loading Google Pay button...</div>
      )}
    </div>
  );
};

export default GooglePayButton;
