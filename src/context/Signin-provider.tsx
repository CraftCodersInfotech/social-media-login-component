
import React from "react";
import { useSigninStore, SigninContext} from "../context/Signin-context"
export interface SigninProviderProps {
  children: React.ReactNode;
}
const LoginProvider: React.FC<SigninProviderProps> = (props) => {
  const { children } = props;
  const userData = useSigninStore();
  return (
    <SigninContext.Provider value={userData}>{children}</SigninContext.Provider>
  );
};
export default LoginProvider;