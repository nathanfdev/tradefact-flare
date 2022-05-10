import React from 'react'
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import { useFields } from '../../packages/use-fields'

export interface LoginModalProps {
  isOpen: boolean

  onToggle: () => void
}

const LoginModal = ({ isOpen, onToggle }: LoginModalProps) => {
  const [{ email, password }] = useFields({
    email: '',
    password: ''
  })

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader toggle={onToggle}>Log In</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for={email.id}>Email Address</Label>
            <InputGroup>
              <InputGroupAddon addonType='prepend'>
                <InputGroupText>
                  <span className='fa fa-envelope' />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type='email'
                name={email.name}
                id={email.id}
                value={email.value}
                onChange={e => email.update(e.target.value)}
                placeholder='Email address'
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for={password.id}>Password</Label>
            <InputGroup>
              <InputGroupAddon addonType='prepend'>
                <InputGroupText>
                  <span className='fa fa-lock' />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type='password'
                name={password.name}
                id={password.id}
                value={password.value}
                onChange={e => password.update(e.target.value)}
                placeholder='Password'
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={onToggle}>
          Log In
        </Button>{' '}
        <Button color='secondary' onClick={onToggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default LoginModal
