import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { MetaMaskProvider } from '@metamask/sdk-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MetaMaskProvider debug={false} sdkOptions={{
      logging: {
        developerMode: false,
      },
      // communicationServerUrl: process?.env?.REACT_APP_COMM_SERVER_URL ?? "",
      communicationServerUrl: "http://localhost:3000",
      checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
      dappMetadata: {
        name: "Demo React App",
        url: window.location.host,
      }
    }}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </MetaMaskProvider>

  </React.StrictMode>,
)
