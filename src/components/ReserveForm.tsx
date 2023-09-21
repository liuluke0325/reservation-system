import { FormControl, FormLabel, Input, FormErrorMessage, Button, Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps, Center } from "@chakra-ui/react"
import { Formik, Form, Field } from "formik"

const steps = [
    { title: 'First', description: 'Wallet' },
    { title: 'Second', description: 'Email' },
    { title: 'Third', description: 'Submitted' },
]

const ReserveForm = () => {

    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    const validateEmail = (value: string) => {
        let error
        if (!value) {
            error = 'Email is required'
        }
        return error
    }

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
                        return <Button onClick={() => { setActiveStep(prev => prev + 1) }}>Next</Button>
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
                                        mt={4}
                                        isLoading={props.isSubmitting}
                                        type='submit'
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik></>
                    case 3:
                        return <Box >Done!</Box>
                }
            })()
            }</Box>

        </Center>

    </>
}


export default ReserveForm