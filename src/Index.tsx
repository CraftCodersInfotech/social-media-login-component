import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
} from "react-native";
import React, { useContext } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { SigninContext } from "./context";
import auth from "@react-native-firebase/auth";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

interface SocialMediaTypes {
  refreshToken?: string;
  viewStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  googleTitle?: string;
  facebookTitle?: string;
  appleTitle?: string;
  color?: string;
  googleicon?: any;
  facebookicon?: any;
  appleicon?: any;
  googleImg?: ImageSourcePropType;
  facebookImg?: ImageSourcePropType;
  appleImg?: ImageSourcePropType;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  defaultImages?: boolean;
  onPress?: () => void;
  onSuccess?: (e: any) => void;
  onError?: (err: any) => void;
  loginType?: (err: any) => void;
}

const socialMedia = (props: SocialMediaTypes) => {
  const {
    refreshToken,
    viewStyle,
    googleTitle,
    facebookTitle,
    appleTitle,
    googleImg,
    facebookImg,
    appleImg,
    imageContainerStyle,
    imageStyle,
    defaultImages = true,
    onPress,
    onError,
    onSuccess,
    appleicon,
    facebookicon,
    googleicon,
    color = "black",
    loginType,
  } = props;

  const { registerUser, setError, setAppleToken } =
    useContext<any>(SigninContext);

  // const googleSignin = async () => {
  //   setError(undefined);
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log("user info", userInfo);
  //     if (onSuccess) {
  //       onSuccess(userInfo);
  //     }
  //     await registerUser(userInfo);
  //   } catch (error: any) {
  //     if (onError) {
  //       onError(error);
  //     }
  //     setError(error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       console.log("error1", error);
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       console.log("error2", error);
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       console.log("error3", error);
  //     } else {
  //       console.log("error4", error);
  //     }
  //   }
  // };

  // const faceBookSignin = async () => {
  //   const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }
  //   const data = await AccessToken.getCurrentAccessToken();

  //   if (!data) {
  //     throw 'Something went wrong obtaining access token';
  //   }

  //   const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  //   return auth().signInWithCredential(facebookCredential);
  // }
  const googleSignin = async () => {
    if (loginType) {
      loginType("Google");
    }
    setError(undefined);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info", userInfo);

      // Create a new Firebase credential with the token
      const { idToken } = userInfo;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      console.log("Firebase user credential:", userCredential);

      if (onSuccess) {
        onSuccess(userCredential);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
      setError(error);
      console.log("Sign-in error:", error);
    }
  };
  async function onAppleButtonPress() {
    if (loginType) {
      loginType("Apple");
    }
    setError(undefined);
    // Start the sign-in request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identify token returned");
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );
      const userInfo = await auth().signInWithCredential(appleCredential);
      if (appleAuthRequestResponse.authorizationCode) {
        getRefreshTokenApi(appleAuthRequestResponse.authorizationCode);
      }
      if (onSuccess) {
        onSuccess(userInfo);
      }
      // Sign the user in with the credential
      registerUser(userInfo);
    } catch (err) {
      if (onError) {
        onError(err);
      }
      setError(err);
    }
  }

  const getRefreshTokenApi = async (authorizationCode: string) => {
    if (authorizationCode && Platform.OS == "ios") {
      const uri = `${refreshToken}?code=${authorizationCode}`;
      await axios
        .post(uri)
        .then((res: { data: any }) => {
          AsyncStorage.setItem(
            "@appleToken",
            JSON.stringify({ token: res.data })
          );
          setAppleToken({ token: res.data });
        })
        .catch((err: any) => {
          console.warn("Refresh token Api calling error : ", err);
        });
    }
  };

  return (
    <View style={viewStyle}>
      {defaultImages ? (
        <>
          <TouchableOpacity
            style={imageContainerStyle}
            onPress={() => {
              googleSignin();
              if (onPress) {
                onPress();
              }
            }}
          >
            {googleicon ? (
              googleicon
            ) : (
              <Image
                style={imageStyle ?? { height: 20, width: 20 }}
                source={require("../src/assets/google.png")}
              />
            )}
            {googleTitle ? (
              <Text style={{ color: color }}>{googleTitle}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={imageContainerStyle}
            // onPress={() => faceBookSignin()}
          >
            {facebookicon ? (
              facebookicon
            ) : (
              <Image
                style={imageStyle ?? { height: 20, width: 20 }}
                source={require("../src/assets/FB.png")}
              />
            )}
            {facebookTitle ? (
              <Text style={{ color: color }}>{facebookTitle}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={imageContainerStyle}
            onPress={() => {
              onAppleButtonPress();
              if (onPress) {
                onPress();
              }
            }}
          >
            <View style={{}}>
              {appleicon ? (
                appleicon
              ) : (
                <Image
                  style={imageStyle ?? { height: 20, width: 20 }}
                  source={require("../src/assets/appleIcon.png")}
                />
              )}
            </View>
            {appleTitle ? (
              <Text style={{ color: color }}>{appleTitle}</Text>
            ) : null}
          </TouchableOpacity>
        </>
      ) : (
        <>
          {googleImg ? (
            <TouchableOpacity
              style={imageContainerStyle}
              onPress={() => {
                googleSignin();
                if (onPress) {
                  onPress();
                }
              }}
            >
              {googleicon ? (
                googleicon
              ) : (
                <Image
                  style={imageStyle ?? { height: 20, width: 20 }}
                  source={googleImg ?? require("../src/assets/google.png")}
                />
              )}
              {googleTitle ? (
                <Text style={{ color: color }}>{googleTitle}</Text>
              ) : null}
            </TouchableOpacity>
          ) : null}
          {facebookImg ? (
            <TouchableOpacity
              style={imageContainerStyle}
              // onPress={() => faceBookSignin()}
            >
              {facebookicon ? (
                facebookicon
              ) : (
                <Image
                  style={imageStyle ?? { height: 20, width: 20 }}
                  source={facebookImg}
                />
              )}
              {facebookTitle ? (
                <Text style={{ color: color }}>{facebookTitle}</Text>
              ) : null}
            </TouchableOpacity>
          ) : null}
          {appleImg ? (
            <TouchableOpacity
              style={imageContainerStyle}
              onPress={() => {
                onAppleButtonPress();
                if (onPress) {
                  onPress();
                }
              }}
            >
              {appleicon ? (
                appleicon
              ) : (
                <Image
                  style={imageStyle ?? { height: 20, width: 20 }}
                  source={appleImg}
                />
              )}
              {appleTitle ? (
                <Text style={{ color: color }}>{appleTitle}</Text>
              ) : null}
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </View>
  );
};

export default socialMedia;
