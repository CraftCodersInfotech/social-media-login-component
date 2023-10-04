import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, { useContext, useEffect } from "react";
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
  webClientId?: string;
  iosClientId?: string;
  refreshToken?: string;
}

const socialMedia = ({
  webClientId,
  iosClientId,
  refreshToken,
}: SocialMediaTypes) => {
  if (webClientId && iosClientId) {
    GoogleSignin.configure({
      webClientId,
      iosClientId,
    });
  } else if (webClientId) {
    GoogleSignin.configure({
      webClientId,
    });
  } else if (iosClientId) {
    GoogleSignin.configure({
      iosClientId,
    });
  }

  const { registerUser, setError, setAppleToken } =
    useContext<any>(SigninContext);

  const googleSignin = async () => {
    setError(undefined);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info", userInfo);
      await registerUser(userInfo);
    } catch (error: any) {
      setError(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("error1", error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("error2", error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("error3", error);
      } else {
        console.log("error4", error);
      }
    }
  };

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

  async function onAppleButtonPress() {
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
      // Sign the user in with the credential
      registerUser(userInfo);
    } catch (err) {
      setError(err);
      console.log("apple Error : ", err);
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
          console.log("Api calling error : ", err);
        });
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          marginVertical: 12,
          paddingVertical: 10,
          backgroundColor: "#cdcdcd",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexDirection: "row",
          borderRadius: 8,
        }}
        onPress={() => googleSignin()}
      >
        <View style={{ marginRight: 15 }}>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../src/assets/google.png")}
          />
        </View>
        <Text>Google SignIn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginVertical: 12,
          paddingVertical: 10,
          backgroundColor: "#cdcdcd",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexDirection: "row",
          borderRadius: 8,
        }}
        // onPress={() => faceBookSignin()}
      >
        <View style={{ marginRight: 15 }}>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../src/assets/FB.png")}
          />
        </View>
        <Text>FaceBook SignIn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginVertical: 12,
          paddingVertical: 10,
          backgroundColor: "#cdcdcd",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexDirection: "row",
          borderRadius: 8,
        }}
        onPress={onAppleButtonPress}
      >
        <View style={{ marginRight: 15 }}>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../src/assets/appleIcon.png")}
          />
        </View>
        <Text>Login with Apple</Text>
      </TouchableOpacity>
    </>
  );
};

export default socialMedia;

const styles = StyleSheet.create({});
