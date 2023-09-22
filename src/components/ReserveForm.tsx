import { FormControl, FormLabel, Input, FormErrorMessage, Button, useSteps, Center, Stack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Box } from "@chakra-ui/react"
import { useSDK } from "@metamask/sdk-react"
import { Formik, Field } from "formik"
import { useState } from "react"
import FormStepper from "./FormStepper";
import { emailValidator, inviteCodeValidator, requiredValidator } from "../utils/validators";
import { api } from "../apis/api";
import { AxiosError } from "axios";

const steps = [
    { title: 'First', description: 'Wallet' },
    { title: 'Second', description: 'Signing' },
    { title: 'Third', description: 'Email' },
    { title: 'Forth', description: 'Complete!' },
]

const initialValues = {
    email: "",
    address: "",
    inviteCode: "",
    signature: "",
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

    // mock for signing
    const sign = async () => {
        const provider = sdk?.getProvider();
        const msgParams = JSON.stringify({
            domain: {
                chainId: parseInt(provider?.chainId ?? "", 16),
                name: "Luke Testing",
                verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
                version: "1",
            },

            // Defining the message signing data content.
            message: {
                contents: "Hello, Luke!",
                attachedMoneyInEth: 4.2,
                from: {
                    name: "Luke Liu",
                    wallets: [
                        "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
                        "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
                    ],
                },
                to: [
                    {
                        name: "Liu Luke",
                        wallets: [
                            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
                            "0xB0B0b0b0b0b0B000000000000000000000000000",
                        ],
                    },
                ],
            },
            primaryType: "Mail",
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Group: [
                    { name: "name", type: "string" },
                    { name: "members", type: "Person[]" },
                ],
                Mail: [
                    { name: "from", type: "Person" },
                    { name: "to", type: "Person[]" },
                    { name: "contents", type: "string" },
                ],
                Person: [
                    { name: "name", type: "string" },
                    { name: "wallets", type: "address[]" },
                ],
            },
        });

        const from = provider?.selectedAddress;

        console.debug(`sign from: ${from}`);
        try {
            if (!from || from === null) {
                alert(`Invalid account -- please connect using eth_requestAccounts first`);
                return;
            }

            const params = [from, msgParams];
            const method = "eth_signTypedData_v4";
            console.debug(`ethRequest ${method}`, JSON.stringify(params, null, 4))
            console.debug(`sign params`, params);
            const resp = await provider?.request({ method, params });
            return resp;
        } catch (e) {
            console.log(e);
        }
    };


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
                            signature: values.signature
                        })

                        setReserveStatus(200);

                    } catch (err) {
                        console.error(err);

                        const errorVal = (err as AxiosError)?.response?.status
                        if (errorVal === 200 || errorVal === 429) {
                            setReserveStatus(errorVal);
                        } else {
                            setReserveStatus(400);
                        }

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

                    <Modal size="xl" isOpen={isOpen} onClose={() => {
                        setActiveStep(1);
                        setReserveStatus(undefined);
                        onClose()
                    }}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                <Box>
                                    <FormStepper activeStep={activeStep} steps={steps}></FormStepper>
                                </Box>

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
                                {activeStep === 2 && (<Stack>
                                    {(connected && account) ?
                                        <>
                                            <FormControl isInvalid={!!errors.signature}>
                                                <FormLabel htmlFor="signature">Signature</FormLabel>
                                                {/* <Field as={Input} readOnly name="signature" validate={requiredValidator} value={values.signature} /> */}
                                                <FormErrorMessage>{errors.signature}</FormErrorMessage>
                                            </FormControl>
                                            <Button
                                                isLoading={isLoading}
                                                type="button"
                                                id="personalSignButton"

                                                onClick={async () => {

                                                    setIsLoading(true);
                                                    setFieldError('signature', undefined);

                                                    try {
                                                        const signature = await sign()

                                                        if (signature) {
                                                            await setFieldValue('signature', signature);
                                                        } else {
                                                            throw Error("Something Wrong")
                                                        }

                                                    } catch (err) {
                                                        setFieldError('signature', 'Please sign again')
                                                        setIsLoading(false);
                                                        return;
                                                    }
                                                    setIsLoading(false);
                                                    console.log(values.signature, 'values.signature')
                                                    !errors.signature && setActiveStep(prev => prev + 1)
                                                }}


                                            >Personal Sign</Button>

                                        </>
                                        : <Button onClick={connect} type="button" isLoading={connecting}>
                                            Connect to MetaMask
                                        </Button >}
                                </Stack>)}
                                {activeStep === 3 && (<>
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
                                {activeStep === 4 && (
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