import { createContext, useCallback, useMemo, useState } from "react";
export interface ISigninContext {
  registerUser: (e:any) => void;
  userData: any;
}
const SigninContextDefaultValue = {
  registerUser: () => {},
  userData: {},
};
export const SigninContext = createContext<ISigninContext>(
    SigninContextDefaultValue
);
export const useSigninStore = () => {
  const [_userData, setUserData] = useState<any>({});
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