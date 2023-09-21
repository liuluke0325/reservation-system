import { useState } from 'react'
import './App.css'
import { Box, Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure } from '@chakra-ui/react'
import ReserveForm from './components/ReserveForm';
import ReserveCodeForm from './components/ReserveCodeForm';




const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Stack>
        <Heading>Reservation System</Heading>
        <ReserveCodeForm afterCodeValidate={onOpen} />
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReserveForm onClickDone={onClose} />
          </ModalBody>

          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default App
