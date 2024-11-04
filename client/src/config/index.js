export const signUpFormControls = [
    {
        name: 'userName',
        label: 'User name',
        placeholder: 'Enter your user name',
        type: 'text',
        componentType: 'input',
    },
    {
        name: 'userEmail',
        label: 'User email',
        placeholder: 'Enter your email',
        type: 'email',
        componentType: 'input',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        componentType: 'input',
    },
]

export const signInFormControls = [
    {
        name: 'userEmail',
        label: 'User email',
        placeholder: 'Enter your email',
        type: 'email',
        componentType: 'input',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        componentType: 'input',
    },
]

export const initialSignInFormData = {
    userEmail: "",
    password: "",
}

export const initialSignUpFormData = {
    userName: "",
    userEmail: "",
    password: "",
}