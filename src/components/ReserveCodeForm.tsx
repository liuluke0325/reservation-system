import { FormControl, FormLabel, Input, FormErrorMessage, Button } from "@chakra-ui/react"
import { Formik, Form, Field } from "formik"
import { api } from "../apis/api"

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
        initialValues={{ code: '' }}
        onSubmit={async (values, actions) => {

            try {
                await api.verifyCode(values.code);
                afterCodeValidate();
            } catch (err) {
                actions.setFieldError("code", (err as Error).message);
            }
            actions.setSubmitting(false);

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