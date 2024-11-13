import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerInstructorService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({children}) {
const [signInFormData, setSignInFormData] = useState(initialSignInFormData);    
const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);    
const [auth, setAuth] = useState({
    authenticate: false,
    user: null
})
const [loading, setLoading] = useState(true)
const navigate = useNavigate();

async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
}

async function handleRegisterInstructor(event) {
    event.preventDefault();
    const data = await registerInstructorService(signUpFormData);
    navigate('/instructor');
}

async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);

    if(data.success) {
        sessionStorage.setItem('accessToken', JSON.stringify(data.data.accessToken))
        setAuth({
            authenticate: true,
            user: data.data.user
        })
    }
    else {
        setAuth({
            authenticate: false,
            user: null
        })
    }
}

    async function checkAuthUser() {
        try {
            const data = await checkAuthService();

            if(data.success) {
                setAuth({
                    authenticate: true,
                    user: data.data.user
                })
                setLoading(false)
            }
            else {
                setAuth({
                    authenticate: false,
                    user: null
                })
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            if(!error?.response?.data?.success) {
                setAuth({
                    authenticate: false,
                    user: null
                })
                setLoading(false)
            }
        }
    }

    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null
        })
    }

    //check auth user
    useEffect(() => {
        checkAuthUser();
    }, [])

    return <AuthContext.Provider value={{
        signInFormData, setSignInFormData,
        signUpFormData, setSignUpFormData,
        handleRegisterUser, handleLoginUser,
        handleRegisterInstructor,
        auth,
        resetCredentials,
    }}>
        {
            loading ? <Skeleton/> : children
        }
    </AuthContext.Provider>
}