import { useState } from 'react'
import './App.css'
import { Box, Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure } from '@chakra-ui/react'
import ReserveForm from './components/ReserveForm';




const App = () => {
  const [inputVal, setInputVal] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Stack>
        <Heading>Invite Code</Heading>
        <Input value={inputVal} onChange={(event) => setInputVal(event.target.value)} placeholder='Enter your invite code' />
        <Box>QQQ{inputVal}</Box>
        <Button onClick={onOpen}>Reserve with Code!</Button>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReserveForm />
          </ModalBody>

          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default App
