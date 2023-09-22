import { Text, FormControl, FormLabel, Input, FormErrorMessage, Button, useSteps, Center, Stack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useSDK } from "@metamask/sdk-react"
import { Formik, Field } from "formik"
import { useState } from "react"
import FormStepper from "./FormStepper";
import { emailValidator, inviteCodeValidator } from "../utils/validators";

const steps = [
    { title: 'First', description: 'Check Wallet' },
    { title: 'Second', description: 'Link Email' },
    { title: 'Third', description: 'Complete!' },
]

const initialValues = {
    email: "",
    address: "",
    inviteCode: "",
};


const ReserveForm = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    const { sdk, connected, connecting } = useSDK();

    const [account, setAccount] = useState<string>();
    const connect = async () => {

        try {
            const accounts = await sdk?.connect() as string[]
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn(`failed to connect..`, err);
        }
    };

    return <>
        <Center>
            <Formik
                initialValues={initialValues}
                validateOnBlur={true}
                validateOnChange={false}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        onClose()
                        actions.setSubmitting(false)
                        setActiveStep(0)
                        actions.resetForm();
                    }, 1000)
                }}
            >{({ handleSubmit, errors, validateField, setFieldValue, submitForm, touched, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <FormControl isInvalid={!!errors.inviteCode}>
                        <FormLabel htmlFor="inviteCode">Invite Code</FormLabel>
                        <Field as={Input} id="inviteCode" name="inviteCode" placeholder='Enter your invite code'
                            validate={inviteCodeValidator} />
                        <FormErrorMessage>{errors.inviteCode}</FormErrorMessage>
                    </FormControl>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        // isLoading={props.isSubmitting}
                        onClick={async () => {
                            await validateField("inviteCode")
                            !errors.inviteCode && touched.inviteCode && onOpen()
                        }}
                        type='button'
                    >
                        Reserve with Code!
                    </Button>

                    <Modal isOpen={isOpen} onClose={() => {
                        setActiveStep(1);
                        onClose()
                    }}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                <FormStepper activeStep={activeStep} steps={steps}></FormStepper>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {activeStep === 1 && (<>
                                    {(connected && account) ?
                                        <Stack>
                                            <Text>{account && `Connected account: ${account}`}</Text>
                                            <Button onClick={async () => {
                                                await setFieldValue('address', account)
                                                await validateField("address")
                                                setActiveStep(prev => prev + 1)
                                            }}>Next
                                            </Button>
                                        </Stack>
                                        : <Button onClick={connect} type="button" isLoading={connecting}>
                                            Connect to MetaMask
                                        </Button >}</>)}
                                {activeStep === 2 && (<>
                                    <FormControl isInvalid={!!errors.email}>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <Field as={Input} name="email" placeholder='Enter Your Email' type="email" validate={emailValidator} />
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    </FormControl>
                                    <Button
                                        width="full"
                                        mt={4}
                                        // isLoading={props.isSubmitting}
                                        onClick={async () => {
                                            await validateField("email")
                                            !errors.email && touched.email && setActiveStep(prev => prev + 1)
                                        }}
                                        type='button'
                                    >
                                        Next
                                    </Button></>)}
                                {activeStep === 3 && (
                                    <Button type="submit"
                                        isLoading={isSubmitting}
                                        onClick={() => {
                                            submitForm() // Fix Modal not able to access form
                                        }}

                                    >Done!
                                    </Button>)}
                            </ModalBody>

                            <ModalFooter>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </form>)}
            </Formik>
        </Center>

    </>
}


export default ReserveForm