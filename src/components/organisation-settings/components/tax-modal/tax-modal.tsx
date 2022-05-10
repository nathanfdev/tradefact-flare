import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  FormFeedback,
  Input,
  Label,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import { toast } from '../../../../helpers'
import {
  minMaxEmptyCharCheck,
  handleKeyDown
} from '../../../../helpers/validations/validations'
import api from '../../../../packages/tradefact-api'
import { Directory } from '../../../../packages/tradefact-objects'
import { useFields } from '../../../../packages/use-fields'

interface TaxModalProps {
  directory: Directory

  onTaxCreated: () => void
  onToggle: () => void
}

const TaxModal = ({ onToggle, directory, onTaxCreated }: TaxModalProps) => {
  const [{ taxId }] = useFields({
    taxId: directory.taxId ?? ''
  })
  const [loading, setLoading] = useState(false)
  const [isValidCheck, setIsValidCheck] = useState(false)

  const taxIdCheck = minMaxEmptyCharCheck(5, 25, taxId.value, 'Tax ID', true)
  const { t } = useTranslation()
  const saveTax = () => {
    setIsValidCheck(true)
    let dirDetails = directory
    if (directory.paymentTerms === 0) {
      dirDetails.paymentTerms = 1
    }
    if (taxIdCheck.Valid) {
      setLoading(true)
      api
        .updateCompany({ ...dirDetails, taxId: taxId.value.trim() })
        .then(() => {
          onTaxCreated()
          onToggle()

          toast(
            t('location.toast.updatedTaxIdSuccessMessage', {
              taxId: taxId.value.trim()
            }),
            {
              title: t('company.updateTaxId'),
              icon: 'success'
            }
          )
        })
        .catch(() =>
          toast(t('validation.genericToastErrorMessage'), {
            title: t('generic.error'),
            icon: 'danger'
          })
        )
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      <div className='modal-header'>
        <h5 className='modal-title'>
          {taxId ? t('company.editTaxID') : t('company.addTaxID')}
        </h5>
        <button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={onToggle}
        >
          <span aria-hidden='true'>
            <i className='fal fa-times'></i>
          </span>
        </button>
      </div>
      <ModalBody>
        <Label className='quote-label' for={taxId.id}>
          {t('taxID')}
        </Label>
        <Input
          type='text'
          value={taxId.value}
          onKeyDown={handleKeyDown}
          onChange={e => taxId.update(e.target.value)}
          placeholder={`${t('taxID')}...`}
          valid={isValidCheck && taxIdCheck.Valid}
          invalid={isValidCheck && !taxIdCheck.Valid}
        />
        <FormFeedback tooltip>{taxIdCheck.Message}</FormFeedback>
      </ModalBody>
      <ModalFooter>
        <Button
          color='primary'
          outline
          onClick={onToggle}
          className='rounded-container'
          role='location-modal-cancel'
        >
          {t('generic.cancel')}
        </Button>
        <Button
          color='primary'
          onClick={saveTax}
          className='rounded-container px-4'
          disabled={loading}
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

export default TaxModal
