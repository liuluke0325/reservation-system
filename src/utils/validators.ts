export const emailValidator = (value: string) => {
    let error;

    if (!value) {
        error = "Required"
    } else if (!value.match(`/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;`)) {
        error = "Invalid Email";
    }

    return error;
}

export const inviteCodeValidator = (value: string) => {
    let error;
    if (!value) {
        error = "Required"
    } else if (!value.match(`/^[A-Z0-9]{10}$/`)) {
        error = "Invalid Invite Code";
    }

    return error;
}