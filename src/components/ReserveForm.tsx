import { Text, FormControl, FormLabel, Input, FormErrorMessage, Button, Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps, Center, Stack } from "@chakra-ui/react"
import { useSDK } from "@metamask/sdk-react"
import { Formik, Form, Field } from "formik"
import { useState } from "react"

const steps = [
    { title: 'First', description: 'Check Wallet' },
    { title: 'Second', description: 'Link Email' },
    { title: 'Third', description: 'Complete!' },
]

type ReserveFormProps = {
    onClickDone?: () => void
}
const ReserveForm = ({ onClickDone }: ReserveFormProps) => {

    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    const validateEmail = (value: string) => {
        let error
        if (!value) {
            error = 'Email is required'
        } else if (!value.match(`^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`)) {
            error = "Invalid Email"
        }
        return error
    }


    const [account, setAccount] = useState<string>();
    const { sdk, connected, connecting } = useSDK();

    const connect = async () => {

        try {
            const accounts = await sdk?.connect() as string[]
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn(`failed to connect..`, err);
        }
    };

    return <>
        <Stepper index={activeStep}>
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
        <Center>
            <Box mt="10"> {(() => {
                switch (activeStep) {
                    case 1:
                        return <>
                            {(connected && account) ? <Stack>
                                <Text>{account && `Connected account: ${account}`}</Text>
                                <Button onClick={() => { setActiveStep(prev => prev + 1) }}>Next</Button>
                            </Stack>
                                : <Button onClick={connect} type="button" isLoading={connecting}>
                                    Connect to MetaMask
                                </Button >}</>
                    case 2:
                        return <><Formik
                            initialValues={{ email: "" }}
                            onSubmit={(values, actions) => {
                                setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2))
                                    actions.setSubmitting(false)
                                    setActiveStep(prev => prev + 1)
                                }, 3000)

                            }}
                        >
                            {(props) => (
                                <Form>
                                    <Field name='email' validate={validateEmail}>
                                        {({ field, form }) => (
                                            <FormControl isInvalid={form.errors.email && form.touched.email}>
                                                <FormLabel>Email</FormLabel>
                                                <Input {...field} placeholder='Enter Your Email' type="email" />
                                                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        width="full"
                                        mt={4}
                                        isLoading={props.isSubmitting}
                                        type='submit'
                                    >
                                        Next
                                    </Button>
                                </Form>
                            )}
                        </Formik></>
                    case 3:
                        return <Button type="button" onClick={onClickDone}>Done!</Button>
                }
            })()
            }</Box>

        </Center>

    </>
}


export default ReserveForm