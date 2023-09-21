import { FormControl, FormLabel, Input, FormErrorMessage, Button } from "@chakra-ui/react"
import { Formik, Form, Field } from "formik"

type ReserveCodeFormProps = {
    afterCodeValidate: () => void
}
const ReserveCodeForm = ({ afterCodeValidate }: ReserveCodeFormProps) => {

    const validateCode = (value: string) => {
        let error
        if (!value) {
            error = 'Reserve code is required'
        } else if (!value.match(`^[A-Z0-9]{10}$`)) {
            error = "Invalid Code"
        }
        return error
    }
    return <Formik
        initialValues={{ name: 'Sasuke' }}
        onSubmit={(values, actions) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                actions.setSubmitting(false)
                afterCodeValidate()
            }, 1000)
        }}
    >
        {(props) => (
            <Form>
                <Field name='code' validate={validateCode}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.code && form.touched.code}>
                            <FormLabel>Invite Code</FormLabel>
                            <Input {...field} placeholder='Enter your invite code' />
                            <FormErrorMessage>{form.errors.code}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                >
                    Reserve with Code!
                </Button>
            </Form>
        )}
    </Formik>
}

export default ReserveCodeForm