import CommonForm from "@/components/common-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function AddNewInstructorPage() {
    const {
        signUpFormData, setSignUpFormData,
        handleRegisterInstructor
      } = useContext(AuthContext);

      const navigate = useNavigate();

    function checkSignUpFormIsValid() {
        return (
          signUpFormData && 
          signUpFormData.userName !== '' && 
          signUpFormData.userEmail !== '' && 
          signUpFormData.password !== ''
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">Create new Instructor</h1>
            </div>
          <div className="items-center justify-center min-h-screen bg-background">
          <Card className="p-6 space-y-4">
                  <CardContent>
                    <CommonForm 
                    formControls={signUpFormControls}
                    buttonText={'Sign Up'}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled = {!checkSignUpFormIsValid()}
                    handleSubmit={handleRegisterInstructor}
                    />
                  </CardContent>
                </Card>
          </div>
        </div>
      )
}

export default AddNewInstructorPage;