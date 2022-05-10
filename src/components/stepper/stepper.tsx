import classNames from 'classnames'
import React from 'react'

export interface StepperStep {
  active: boolean
  color?: string
  disabled?: boolean
  icon?: string
  title: string

  onClick: () => void
}

export interface StepperProps {
  steps: StepperStep[]
}

const Stepper = ({ steps }: StepperProps) => {
  if (steps.length <= 0) {
    return null
  }

  return (
    <div className='stepper' data-component='stepper'>
      {steps.map(step => (
        <div
          key={step.title}
          className={classNames(
            'stepper-step',
            step.active && 'is-active',
            step.color,
            step.disabled && 'is-disabled'
          )}
        >
          <a
            className='stepper__link'
            href='#'
            onClick={e => {
              e.preventDefault()
              step.onClick()
            }}
          >
            {step.icon && <i className={step.icon}></i>}
            <span className='ml-2'>{step.title}</span>
          </a>
        </div>
      ))}
      {/*

      <div className='stepper__step is-success'>
        <a className='stepper__link' href='#'>
          <span className='step__icon'>
            <i className='fas fa-check'></i>
          </span>
          <span className='step__text'>Success Step</span>
        </a>
      </div>

      <div className='stepper__step is-warning'>
        <a className='stepper__link' href='#'>
          <span className='step__icon'>
            <i className='fas fa-exclamation-triangle'></i>
          </span>
          <span className='step__text'>Warning Step</span>
        </a>
      </div>

      <div className='stepper__step is-danger'>
        <a className='stepper__link' href='#'>
          <span className='step__icon'>
            <i className='fas fa-exclamation'></i>
          </span>
          <span className='step__text'>Danger Step</span>
        </a>
      </div>

      <div className='stepper__step is-info'>
        <a className='stepper__link' href='#'>
          <span className='step__icon'>
            <i className='fas fa-question'></i>
          </span>
          <span className='step__text'>Info Step</span>
        </a>
      </div>

      <div className='stepper__step is-disabled'>
        <a className='stepper__link' href='#'>
          <span className='step__icon'>
            <i className='fas fa-ban'></i>
          </span>
          <span className='step__text'>Disabled Step</span>
        </a>
      </div>

      <div className='stepper__step'>
        <a className='stepper__link' href='#'>
          <span className='step__icon'>
            <i className='fas fa-clipboard'></i>
          </span>
          <span className='step__text'>Example Step</span>
        </a>
      </div>
      */}
    </div>
  )
}

export default Stepper
