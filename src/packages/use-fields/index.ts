import { Schema, ValidationResult } from '@hapi/joi'
import { useMemo, useReducer } from 'react'
import { v4 as uuid } from 'uuid'

export type FieldValue = Date | string | number | boolean

export type FieldDescriptors<V> = {
  [name: string]: FieldDescriptor<V>
}

export type FieldDescriptor<V> = {
  id: string
  name: string
  result?: ValidationResult
  value: V

  update: (value: V) => void
}

export type UseFieldsConfigurationObjectSchemaFunction = () => Schema

export type UseFieldsConfigurationObject<V> = {
  schema?: UseFieldsConfigurationObjectSchemaFunction | Schema
  value: V

  onChange?: (value: V) => void
}

export type UseFieldsConfiguration<V> = {
  [name: string]: UseFieldsConfigurationObject<V> | V
}

export type UseFieldsResult<C> = {
  [K in keyof C]: C[K] extends UseFieldsConfigurationObject<FieldValue>
    ? FieldDescriptor<C[K]['value']>
    : FieldDescriptor<C[K]>
}

export type UseFieldsValidateFunction = () => boolean

const isConfigurationObject = (
  x: unknown
): x is UseFieldsConfigurationObject<FieldValue> =>
  !['string', 'number', 'boolean'].includes(typeof x)

type UseFieldsReducerAction = {
  name: string
  result?: ValidationResult
  value: FieldValue
}

type UseFieldsReducerState = {
  [name: string]: FieldDescriptor<FieldValue>
}

const useFieldsReducer = (
  state: UseFieldsReducerState,
  action: UseFieldsReducerAction
): UseFieldsReducerState => {
  return {
    ...state,
    [action.name]: {
      ...state[action.name],
      result: action.result,
      value: action.value
    }
  }
}

export const useFields = <C extends UseFieldsConfiguration<V>, V = FieldValue>(
  config: C
): [UseFieldsResult<C>, UseFieldsValidateFunction] => {
  const [state, dispatch] = useReducer(useFieldsReducer, undefined, () =>
    Object.keys(config).reduce((current, name) => {
      const option = config[name]

      const value = isConfigurationObject(option) ? option['value'] : option
      const update = (value: FieldValue) => {
        if (isConfigurationObject(option)) {
          const validator =
            typeof option.schema === 'function'
              ? option.schema()
              : option.schema
          const result = validator?.validate(value)
          option?.onChange?.(value)
          dispatch({ name, value, result })
        } else {
          dispatch({ name, value, result: undefined })
        }
      }

      const descriptor = {
        id: uuid(),
        name,
        value,
        update
      }

      return { ...current, [name]: descriptor }
    }, {})
  )

  const validate = useMemo(
    () => () => {
      let areFieldsValid = true
      Object.keys(state).forEach(name => {
        const option = config[name]
        const currentState = state[name]

        if (isConfigurationObject(option)) {
          const value = currentState.value
          const validator =
            typeof option.schema === 'function'
              ? option.schema()
              : option.schema
          const result = validator?.validate(value)
          if (result && result.error) {
            areFieldsValid = false
          }

          dispatch({ name, value, result })
        }
      })

      return areFieldsValid
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  return [state as UseFieldsResult<C>, validate]
}
