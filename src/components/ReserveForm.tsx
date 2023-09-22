import { FormControl, FormLabel, Input, FormErrorMessage, Button, useSteps, Center, Stack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Box } from "@chakra-ui/react"
import { useSDK } from "@metamask/sdk-react"
import { Formik, Field } from "formik"
import { useState } from "react"
import FormStepper from "./FormStepper";
import { emailValidator, inviteCodeValidator, requiredValidator } from "../utils/validators";
import { api } from "../apis/api";

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

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reserveStatus, setReserveStatus] = useState<200 | 400 | 429>();
    return <>
        <Center>
            <Formik
                initialValues={initialValues}
                validateOnBlur={true}
                validateOnChange={false}
                onSubmit={async (values, actions) => {

                    try {
                        await api.reverse({
                            code: values.inviteCode,
                            email: values.email,
                            walletAddress: values.address,
                            signature: ""
                        })

                        setReserveStatus(200);

                    } catch (error) {
                        console.error(error.response.status);
                        setReserveStatus(error.response.status);
                    }

                    actions.setSubmitting(false)


                }}
            >{({ handleSubmit, values, errors, validateField, setFieldValue, submitForm, touched, isSubmitting, setFieldError }) => (
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
                        isLoading={isLoading}
                        onClick={async () => {
                            await validateField("inviteCode")
                            if (errors.inviteCode) {
                                return;
                            }
                            try {
                                setIsLoading(true);
                                await api.verifyCode(values.inviteCode)
                            } catch (err) {
                                setFieldError('inviteCode', 'Invite code has reach out the limit')
                                setIsLoading(false);
                                return;
                            }
                            setIsLoading(false);
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
                                {activeStep === 1 && (<Stack>
                                    {(connected && account) ?
                                        <>
                                            <FormControl isInvalid={!!errors.address}>
                                                <FormLabel htmlFor="address">Connected account:</FormLabel>
                                                <Field as={Input} readOnly name="address" validate={requiredValidator} value={account} />
                                                <FormErrorMessage>{errors.address}</FormErrorMessage>
                                            </FormControl>

                                            <Button
                                                isLoading={isLoading}
                                                onClick={async () => {
                                                    await setFieldValue('address', account)
                                                    await validateField("address")

                                                    if (errors.address) {
                                                        return;
                                                    }
                                                    try {
                                                        setIsLoading(true);
                                                        await api.isWalletUsed(values.address)
                                                    } catch (err) {
                                                        setFieldError('address', 'Wallet has been used')
                                                        setIsLoading(false);
                                                        return;
                                                    }
                                                    setIsLoading(false);
                                                    !errors.address && setActiveStep(prev => prev + 1)
                                                }}>Next
                                            </Button>
                                        </>
                                        : <Button onClick={connect} type="button" isLoading={connecting}>
                                            Connect to MetaMask
                                        </Button >}
                                </Stack>)}
                                {activeStep === 2 && (<>
                                    <FormControl isInvalid={!!errors.email}>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <Field as={Input} name="email" placeholder='Enter Your Email' type="email" validate={emailValidator} />
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    </FormControl>
                                    <Button
                                        width="full"
                                        mt={4}
                                        isLoading={isLoading}
                                        onClick={async () => {
                                            await validateField("email")
                                            if (errors.email) {
                                                return;
                                            }
                                            try {
                                                setIsLoading(true);
                                                await api.isEmailUsed(values.email)
                                            } catch (err) {
                                                setFieldError('email', 'Email has been used')
                                                setIsLoading(false);
                                                return;
                                            }
                                            setIsLoading(false);

                                            !errors.email && touched.email && setActiveStep(prev => prev + 1)





                                        }}
                                        type='button'
                                    >
                                        Next
                                    </Button></>)}
                                {activeStep === 3 && (
                                    <Stack>

                                        {reserveStatus === 200 && <Center color="green">Reserve Completed</Center>}
                                        {reserveStatus === 400 && <Center color="red">Something Goes Wrong, Please Try Again</Center>}
                                        {reserveStatus === 429 && <Center color="red">Too many requests, please try again later</Center>}
                                        {reserveStatus !== 200 && <Button type="submit"
                                            isLoading={isSubmitting}
                                            onClick={() => {
                                                submitForm() // Fix Modal not able to access form
                                            }}

                                        >Click To Reserve!
                                        </Button>}</Stack>
                                )}
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