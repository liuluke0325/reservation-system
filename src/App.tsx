import { useState } from 'react'
import './App.css'
import { Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure } from '@chakra-ui/react'
import ReserveForm from './components/ReserveForm';
import ReserveCodeForm from './components/ReserveCodeForm';




const App = () => {
  // const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Stack>
        <Heading>Reservation System</Heading>
        {/* <ReserveCodeForm afterCodeValidate={onOpen} /> */}
        <ReserveForm></ReserveForm>
      </Stack>


    </>
  )
}

export default App
