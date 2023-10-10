import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
export interface ISigninContext {
  registerUser: (e: any) => void;
  userData: any;
  error: any;
  appleToken: any;
  setError: any;
}
const SigninContextDefaultValue = {
  registerUser: () => {},
  userData: {},
  error: undefined,
  appleToken: {},
  setAppleToken: () => {},
  setError: () => {},
};
export const SigninContext = createContext<ISigninContext>(
  SigninContextDefaultValue
);
export const useSigninStore = () => {
  const [_userData, setUserData] = useState<any>({});
  const [error, setError] = useState({});
  const [appleToken, setAppleToken] = useState({});
  const registerUser = useCallback((fdata: string) => {
    setUserData({
      Data: fdata,
    });
  }, []);

  const getAppleToken = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@appleToken");
      const res = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (res) {
        setAppleToken(res);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getAppleToken();
  }, []);

  return useMemo(
    () => ({
      registerUser,
      userData: _userData,
      setError,
      error,
      appleToken,
      setAppleToken,
    }),
    [_userData, error, appleToken]
  );
};
