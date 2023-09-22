import './App.css'
import { Heading, Stack } from '@chakra-ui/react'
import ReserveForm from './components/ReserveForm';

const App = () => {

  return (
    <>
      <Stack>
        <Heading>Reservation System</Heading>
        <ReserveForm></ReserveForm>
      </Stack>
    </>
  )
}

export default App
