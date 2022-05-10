import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { useAppDispatch, useAppSelector } from '../../components/app'
import OrderFormShipmentStep from './steps/shipment-step'
import OrderFormDeliveryStep from './steps/delivery-step'
import OrderFormSetupStep from './steps/setup-step'
import {
  initialState as newOrderInitialState,
  InitialState as NewOrderInitialState,
  OrderCompletionState,
  resetSlice,
  saveCountryFilter,
  toggleStepValidity,
  toggleState
} from '../../reducers/create-order-slice'
import OrderFormSummaryStep from './steps/summary-step'
import {
  getEarliestShipmentDate,
  placeOrder
} from '../../packages/tradefact-api/order'
import { NewOrderRequest, Steps } from '../../packages/tradefact-objects/order'

const stepIndices = Object.values(Steps)
interface StepObject {
  icon: string
  disabled: boolean
  alt?: string
  title: Steps
}
const steps: StepObject[] = [
  {
    icon: 'fas fa-ship',
    disabled: false,
    title: Steps.SHIPMENT
  },
  {
    icon: 'fas fa-truck',
    disabled: false,
    title: Steps.DELIVERY
  },
  {
    icon: 'fas fa-boxes',
    disabled: false,
    title: Steps.SETUP
  },
  {
    icon: 'fas fa-check',
    disabled: false,
    title: Steps.SUMMARY
  }
]

const CreateOrder = () => {
  const history = useHistory()
  const [activeStep, setActiveStep] = useState<Steps>(Steps.SHIPMENT)
  const {
    addressFormState,
    orderCompletionState,
    modalOpen,
    countryFilter
  } = useAppSelector(state => state.orderForm)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const methods = useForm<NewOrderInitialState>({
    defaultValues: newOrderInitialState
  })

  const handleToggle = () => {
    history.goBack()
    dispatch(toggleState('modalOpen'))
    setTimeout(() => {
      // Wrap reset in timeout due to prevent render errors & allow animation
      dispatch(resetSlice())
    }, 500)
  }

  const onSubmit = (data: NewOrderInitialState) => {
    const newOrder: NewOrderRequest = data.newOrder

    const formattedOrderRequest = {
      ...newOrder,
      ...{
        transportMode: newOrder.transportMode?.value,
        referenceType: newOrder.referenceType?.value
      }
    }
    dispatch(placeOrder(formattedOrderRequest))
    handleToggle()
  }

  const renderStep = (activeStep: Steps) => {
    switch (activeStep) {
      case Steps.SHIPMENT:
        return <OrderFormShipmentStep />
      case Steps.DELIVERY:
        return <OrderFormDeliveryStep />
      case Steps.SETUP:
        return <OrderFormSetupStep />
      case Steps.SUMMARY:
        return <OrderFormSummaryStep />
      default:
        return <div>Error</div>
    }
  }

  const resaveData = () => {
    // This functions resyncs the RFH state with the Redux state
    dispatch(saveCountryFilter(methods.getValues('countryFilter')))
    dispatch(getEarliestShipmentDate(countryFilter?.value.code))
  }

  const nextStep = async () => {
    const nextIndex = Object.values(Steps).indexOf(activeStep) + 1
    await methods.trigger().then(pass => {
      if (pass) {
        if (nextIndex == 1) {
          // restrict this to the first step to prevent overwrites
          resaveData()
        }

        dispatch(
          toggleStepValidity({
            target: (activeStep as unknown) as keyof OrderCompletionState,
            value: true
          })
        )

        setActiveStep(Object.values(Steps)[nextIndex])
      } else {
        dispatch(
          toggleStepValidity({
            target: (activeStep as unknown) as keyof OrderCompletionState,
            value: false
          })
        )
      }
    })
  }

  const prevStep = () => {
    const nextIndex = Object.values(Steps).indexOf(activeStep) - 1
    setActiveStep(Object.values(Steps)[nextIndex])
  }

  const StepperStep = ({
    index,
    step
  }: {
    index: number
    step: StepObject
  }) => {
    const stepState =
      orderCompletionState[step.title as keyof OrderCompletionState]

    const isActive = step.title == activeStep

    const isDisabled =
      step.title !== activeStep &&
      stepState == false &&
      orderCompletionState[
        steps[index - 1]?.title as keyof OrderCompletionState
      ] !== true

    return (
      <div
        key={step.title}
        className={classNames(
          'stepper-step',
          isActive && 'is-active',
          isDisabled && 'is-disabled'
        )}
      >
        <a
          className='stepper__link'
          href='#'
          onClick={async e => {
            e.preventDefault()
            if (!addressFormState.toggleForm) {
              if (
                stepIndices.indexOf(step.title) <
                stepIndices.indexOf(activeStep)
              ) {
                setActiveStep(step.title)
              } else {
                await methods.trigger().then(pass => {
                  if (pass) setActiveStep(step.title)
                })
              }
            }
          }}
        >
          {step.icon && <i className={step.icon}></i>}
          <span className='ml-2'>
            {t('newOrderForm.' + step.title.toLowerCase())}
          </span>
        </a>
      </div>
    )
  }

  return (
    <Modal isOpen={modalOpen} className='order-form'>
      <ModalHeader toggle={handleToggle}>
        <div className='order-form__stepper d-flex position-absolute align-items-center justify-content-center'>
          <div className='stepper' data-component='stepper'>
            {steps.map((step, i) => (
              <StepperStep index={i} key={step.title} step={step} />
            ))}
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <form>{renderStep(activeStep)}</form>
        </FormProvider>
      </ModalBody>
      {activeStep == Steps.SUMMARY ? (
        <ModalFooter>
          {stepIndices.indexOf(activeStep) !== 0 && (
            <button
              onClick={prevStep}
              className='btn btn-outline-primary mr-auto'
            >
              Previous
            </button>
          )}
          <input
            className='btn btn-primary ml-auto'
            type='submit'
            value={t('newOrderForm.placeOrder') as string}
            onClick={methods.handleSubmit(onSubmit)}
          />
        </ModalFooter>
      ) : !addressFormState.toggleForm ? (
        <ModalFooter className='d-flex'>
          {stepIndices.indexOf(activeStep) !== 0 && (
            <button
              onClick={prevStep}
              className='btn btn-outline-primary mr-auto'
            >
              {t('generic.previous')}
            </button>
          )}
          {stepIndices.indexOf(activeStep) < stepIndices.length - 1 && (
            <input
              type='submit'
              value={t('generic.next') as string}
              onClick={nextStep}
              className='btn btn-primary ml-auto'
            />
          )}
        </ModalFooter>
      ) : null}
    </Modal>
  )
}

export default CreateOrder
