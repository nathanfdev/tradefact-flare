import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Col,
  CustomInput,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  ModalBody,
  ModalFooter,
  Row
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { toast } from '../../../../helpers'
import {
  isEmailValid,
  isOnlyLetters,
  isValueEmpty,
  minMaxEmptyCharCheck,
  ValidationResult,
  handleKeyDown
} from '../../../../helpers/validations/validations'
import api from '../../../../packages/tradefact-api'
import {
  Address,
  InviteType,
  InviteUserInfo,
  User
} from '../../../../packages/tradefact-objects'
import { useFields } from '../../../../packages/use-fields'

interface UserModalProps {
  editUser?: User | null
  companyName?: string

  onUserSaved: () => void
  onToggle: () => void
}

interface ValidationField {
  value: string
  valueName: string
  min: number
  max: number
  lettersOnly?: boolean
}

const validateField = ({
  value,
  valueName,
  min,
  max,
  lettersOnly = false
}: ValidationField): ValidationResult => {
  const emptyValueCheck = isValueEmpty(value, valueName)
  const minMaxCheck = minMaxEmptyCharCheck(min, max, value, valueName, true)
  const onlyLettersCheck = isOnlyLetters(value, valueName, true)

  if (!emptyValueCheck.Valid) {
    return emptyValueCheck
  }

  if (!minMaxCheck.Valid) {
    return minMaxCheck
  }

  if (lettersOnly && !onlyLettersCheck.Valid) {
    return onlyLettersCheck
  }

  return { Valid: true, Message: 'Valid' }
}

const UserModal = ({
  onUserSaved,
  onToggle,
  editUser,
  companyName
}: UserModalProps) => {
  const [locations, setLocations] = useState<Address[]>([])
  const [validationErrorCount, setValidationErrorCount] = useState(0)
  const [isValidCheck, setIsValidCheck] = useState(false)
  const [{ givenName, surname, email, phone, location }] = useFields({
    givenName: editUser?.givenName ?? '',
    surname: editUser?.familyName ?? '',
    email: editUser?.email ?? '',
    phone: editUser?.phoneNumber ?? '',
    location: editUser?.locationId ?? ''
  })
  const [showEmailInUseMessage, setShowEmailInUseMessage] = useState(false)
  const { t } = useTranslation()
  const givenNameCheck = validateField({
    value: givenName.value,
    valueName: t('user.firstName'),
    min: 3,
    max: 30,
    lettersOnly: true
  })
  const surnameCheck = validateField({
    value: surname.value,
    valueName: t('user.surname'),
    min: 3,
    max: 30,
    lettersOnly: true
  })
  const emailCheck = isEmailValid(email.value, true)
  const phoneCheck = validateField({
    value: phone.value,
    valueName: t('user.phoneNumber'),
    min: 3,
    max: 15
  })
  const locationCheck = validateField({
    value: location.value,
    valueName: t('location'),
    min: 3,
    max: 100
  })

  const validate = () => {
    const validatedFields = editUser
      ? [givenNameCheck, surnameCheck, emailCheck, phoneCheck, locationCheck]
      : [givenNameCheck, emailCheck]

    const invalidFields = validatedFields.reduce(
      (acc, v) => (v.Valid ? acc : ++acc),
      0
    )

    setValidationErrorCount(invalidFields)
    return invalidFields === 0
  }

  const [loading, setLoading] = useState(false)

  const getFieldsValueAsUserObject = (): User => {
    if (editUser) {
      return {
        ...editUser,
        fullname: givenName.value.trim() + ' ' + surname.value.trim(),
        givenName: givenName.value.trim(),
        familyName: surname.value.trim(),
        phoneNumber: phone.value.trim(),
        locationId: location.value
      }
    } else {
      return {
        fullname: givenName.value.trim() + ' ' + surname.value.trim(),
        givenName: givenName.value.trim(),
        familyName: surname.value.trim(),
        phoneNumber: phone.value.trim(),
        locationId: location.value,
        email: email.value.trim(),
        isExposedToOtherOrganization: false
      }
    }
  }

  const getInviteInfoObject = (): InviteUserInfo => {
    return {
      givenName: givenName.value.trim(),
      emailAddress: email.value.trim(),
      inviteType: InviteType.AdditionalUser,
      companyName: companyName
    }
  }

  const toggleAndClearFields = () => {
    onToggle()
  }

  const saveUser = () => {
    setIsValidCheck(true)

    if (editUser) {
      if (validate()) {
        setLoading(true)
        api
          .updateUser(getFieldsValueAsUserObject())
          .then(() => {
            onUserSaved()
            toggleAndClearFields()
            toast(t('user.toast.userUpdateMessage'), {
              title: t('user.toast.updateTitle'),
              icon: 'success'
            })
          })
          .catch(() => {
            toast(t('validation.genericToastErrorMessage'), {
              title: t('generic.error'),
              icon: 'danger'
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } else {
      if (validate()) {
        setLoading(true)
        api
          .inviteUser(getInviteInfoObject())
          .then(result => {
            if (result.status === 409) {
              setShowEmailInUseMessage(true)
              return
            }

            onUserSaved()
            toggleAndClearFields()
            toast(t('user.toast.newUserAddedMessage'), {
              title: t('user.newUser'),
              icon: 'success'
            })
          })
          .catch(() => {
            toast(t('validation.genericToastErrorMessage'), {
              title: t('generic.error'),
              icon: 'danger'
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    api
      .listCompanyAddressesNoPaging()
      .then(page => setLocations(page.items))
      .catch(() => {
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      })
  }, [])

  useEffect(() => {
    if (isValidCheck) {
      validate()
    }
  }, [validate, isValidCheck])

  return (
    <>
      <div className='modal-header'>
        <h5 className='modal-title'>
          {editUser?.fullname
            ? `${t('generic.edit')} ${editUser.fullname}`
            : t('user.newUser')}
        </h5>
        <button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={toggleAndClearFields}
        >
          <span aria-hidden='true'>
            <i className='fal fa-times'></i>
          </span>
        </button>
      </div>
      <ModalBody>
        <Row>
          <Col sm={12} md={editUser ? 6 : 12}>
            <FormGroup>
              <Label className='quote-label'>
                {editUser ? t('user.firstName') : t('user.fullName')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('user.name')}...`}
                id={givenName.id}
                name={givenName.name}
                value={givenName.value}
                onKeyDown={handleKeyDown}
                onChange={e => givenName.update(e.target.value)}
                valid={isValidCheck && givenNameCheck.Valid}
                invalid={isValidCheck && !givenNameCheck.Valid}
              />
              <FormFeedback tooltip>{givenNameCheck.Message}</FormFeedback>
            </FormGroup>
          </Col>
          {editUser && (
            <Col sm={12} md={6}>
              <FormGroup>
                <Label className='quote-label'>{t('user.surname')}</Label>
                <Input
                  type='text'
                  placeholder={`${t('user.surname')}...`}
                  id={surname.id}
                  name={surname.name}
                  value={surname.value}
                  onKeyDown={handleKeyDown}
                  onChange={e => surname.update(e.target.value)}
                  valid={isValidCheck && surnameCheck.Valid}
                  invalid={isValidCheck && !surnameCheck.Valid}
                />
                <FormFeedback tooltip>{surnameCheck.Message}</FormFeedback>
              </FormGroup>
            </Col>
          )}
        </Row>{' '}
        <Row>
          <Col sm={12} md={editUser ? 6 : 12}>
            <FormGroup>
              <Label className='quote-label'>{t('generic.emailAddress')}</Label>
              <Input
                type='text'
                placeholder={`${t('generic.emailAddress')}...`}
                id={email.id}
                name={email.name}
                value={email.value}
                onKeyDown={handleKeyDown}
                onChange={e => email.update(e.target.value)}
                valid={isValidCheck && emailCheck.Valid}
                invalid={isValidCheck && !emailCheck.Valid}
                disabled={editUser ? true : false}
              />
              <FormFeedback tooltip>{emailCheck.Message}</FormFeedback>
            </FormGroup>
          </Col>
          {editUser ? (
            <Col sm={12} md={6}>
              <FormGroup>
                <Label className='quote-label'>{t('user.phoneNumber')}</Label>
                <Input
                  type='text'
                  placeholder={`${t('user.phoneNumber')}...`}
                  id={phone.id}
                  name={phone.name}
                  value={phone.value}
                  onKeyDown={handleKeyDown}
                  onChange={e => phone.update(e.target.value)}
                  valid={isValidCheck && phoneCheck.Valid}
                  invalid={isValidCheck && !phoneCheck.Valid}
                />
                <FormFeedback tooltip>{phoneCheck.Message}</FormFeedback>
              </FormGroup>
            </Col>
          ) : null}
        </Row>
        {editUser ? (
          <Row>
            <Col sm={12} md={6}>
              <FormGroup>
                <Label className='quote-label' htmlFor={location.id}>
                  {t('user.location')}
                </Label>
                <CustomInput
                  type='select'
                  name={location.name}
                  id={location.id}
                  value={location.value}
                  onChange={e => location.update(e.target.value)}
                  valid={isValidCheck && locationCheck.Valid}
                  invalid={isValidCheck && !locationCheck.Valid}
                >
                  <option hidden>{t('user.location')}</option>
                  {locations.map(location => {
                    return (
                      <option
                        key={location.id}
                        value={location.id}
                      >{`${location.name}, ${location.city}, ${location.country?.name}`}</option>
                    )
                  })}
                </CustomInput>
                <FormFeedback tooltip>{locationCheck.Message}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        ) : null}
        {validationErrorCount > 0 && (
          <Row>
            <Col>
              <Alert color='danger'>
                {t('validation.seeAboveErrorMessage')}
              </Alert>
            </Col>
          </Row>
        )}
        {showEmailInUseMessage && (
          <Row>
            <Col>
              <Alert color='danger'>{t('user.emailAlreadyUseMessage')}</Alert>
            </Col>
          </Row>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color='primary'
          outline
          onClick={toggleAndClearFields}
          role='location-modal-cancel'
          className='rounded-container'
        >
          {t('generic.cancel')}
        </Button>
        <Button
          color='primary'
          onClick={saveUser}
          disabled={loading}
          className='rounded-container px-4'
        >
          {loading && (
            <span
              className='spinner-border spinner-border-sm mr-2'
              role='status'
              aria-hidden='true'
            ></span>
          )}
          {t('generic.save')}
        </Button>{' '}
      </ModalFooter>
    </>
  )
}

export default UserModal
