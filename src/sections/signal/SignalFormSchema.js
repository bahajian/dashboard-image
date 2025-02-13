// SignalFormSchema.js

import * as Yup from 'yup';

export const SignalSchema = Yup.object().shape({
  symbol: Yup.string().required('Symbol is required'),
  assetType: Yup.string().required('Asset Type is required'),
  tradeType: Yup.string().required('Trade Type is required'),
  buyOrSell: Yup.string().required('Buy or Sell is required'),
  allocationPercentage: Yup.number()
    .typeError('Allocation Percentage must be a number')
    .min(0, 'Allocation must be at least 0%')
    .max(100, 'Allocation cannot exceed 100%')
    .required('Allocation Percentage is required'),
  signalExpirationTime: Yup.date().nullable(),
  takeProfit: Yup.number().nullable(),
  stopLoss: Yup.number().nullable(),
  enablePriceTarget: Yup.boolean(),
});
