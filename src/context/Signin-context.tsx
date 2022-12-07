import { createContext, useCallback, useMemo, useState } from "react";
export interface ISigninContext {
  registerUser: (
    fdata:string
  ) => void;
  userData: any;
}
const SigninContextDefaultValue = {
  registerUser: () => undefined,
  userData: null,
};
export const SigninContext = createContext<ISigninContext>(
    SigninContextDefaultValue
);
export const useSigninStore = () => {
  const [_userData, setUserData] = useState<any>(null);
  const registerUser = useCallback(
    (fdata:string) => {
      setUserData({
        Data: fdata,
      });
    },
    []
  );
  return useMemo(
    () => ({
      registerUser,
      userData: _userData,
    }),
    [_userData]
  );
};