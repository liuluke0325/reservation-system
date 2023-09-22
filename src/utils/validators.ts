export const emailValidator = (value: string) => {
    let error;

    if (!value) {
        error = "Required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        error = "Invalid Email";
    }

    return error;
}

export const inviteCodeValidator = (value: string) => {
    let error;
    if (!value) {
        error = "Required"
    } else if (!/^[A-Z0-9]{10}$/.test(value)) {
        error = "Invalid Invite Code";
    }
    return error;
}

export const requiredValidator = (value: string) => {
    let error;
    if (!value) {
        error = "Required"
    }
    return error;
}