import { Billing, BillingStatus, BillingType } from '../tradefact-objects'

export const listBillings = async (): Promise<Billing[]> => {
  return [
    {
      activityName: 'Earl Grey Tea',
      id: 'IPSH-382',
      type: BillingType.Air,
      issue: new Date(),
      due: new Date(),
      status: BillingStatus.Paid,
      amount: 1234,
      vat: 123,
      totalPrice: 1357
    },
    {
      activityName: 'Green Tea',
      id: 'IPSH-383',
      type: BillingType.Sea,
      issue: new Date(),
      due: new Date(),
      status: BillingStatus.Pending,
      amount: 1234,
      vat: 123,
      totalPrice: 1357
    }
  ]
}
