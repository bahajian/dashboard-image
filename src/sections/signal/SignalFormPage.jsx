// src/pages/SignalFormPage.jsx

import React from 'react';
import { Formik, Form } from 'formik';
import SignalForm from '../components/SignalForm';

export default function SignalFormPage() {
  const initialValues = {
    name: '',
    symbol: '',
    logoUrl: '',
    currentPrice: '',
    assetType: '',
    tradeType: '',
    buyOrSell: '',
    takeProfit: '',
    stopLoss: '',
    allocationPercentage: '',
    signalExpirationTime: '',
  };

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
    // Perform your submit logic, e.g., calling an API.
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formikProps) => (
        <Form>
          <SignalForm formik={formikProps} />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
