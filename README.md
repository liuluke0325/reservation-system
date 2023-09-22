# reservation-system

A project demo using react + typescript + Chakra UI + MetaMask SDK to create a simple reservation system.

## Design Choices

* React: Fast development using a component-based approach.
* TypeScript: Prevent type-related errors for better code quality.
* React Vite: Quick development and compile times.
* Chakra UI: Quick UI development with customizable components.
* MetaMask/sdk-react: Official MetaMask integration for React.
* can-fixture: Mocking responses for efficient testing.

## Getting Started

To start the development server, run:

```bash
npm run dev
```

To build the project, run:

```bash
npm run build
```

### Folder Structure

```bash
src/
  apis/ // API related
  components/  // all the components
  fixture/ // to mock API response
  utils/ // utils functions
```

### How to test it

To ensure the functionality of this project, follow these steps:  

1. Browser Compatibility: Test the project in both Google Chrome and Mozilla Firefox to ensure cross-browser compatibility.  

2. Customize API Response: You can customize the API responses for testing purposes. Follow these steps to adjust the predefined API responses:  
   * Navigate to the src/fixture/ directory.
   * Locate the fixture.js file and open it for editing.  

3. Modify API Responses: In fixture.js, you can modify the predefined API responses to simulate different scenarios and error handling.

   ```ts
   // comment out or change the response status code
   // response(429); 
   response(200); 
   ```

4. View Error Handling: After customizing the API response in fixture.js, the user interface (UI) should display the corresponding error handling based on the modified API responses.

### Author

This project was created by Luke Liu.
