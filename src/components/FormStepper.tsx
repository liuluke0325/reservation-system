import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, Box } from "@chakra-ui/react"

type FormStepperProps = {
    activeStep: number
    steps: {
        title: string;
        description: string;
    }[]
}
const FormStepper = ({ activeStep, steps }: FormStepperProps) => {
    return <Stepper index={activeStep}>
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
}

export default FormStepper