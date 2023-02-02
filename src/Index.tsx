import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
import { SigninContext } from "./context"
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const socialMedia = () => {
  const { registerUser, userData } = useContext<any>(SigninContext);
  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await registerUser(userInfo);
      console.log("user info", userInfo);

    } catch (error: any) {
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

  const faceBookSignin = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    return auth().signInWithCredential(facebookCredential);
  }

  return (
    <>
      <TouchableOpacity style={{ marginVertical: 12, paddingVertical: 10, backgroundColor: "#cdcdcd", alignItems: "center", justifyContent: "center", width: "100%", flexDirection: "row",borderRadius:8 }}
        onPress={() => googleSignin()}>
        <View style={{ marginRight: 15 }}>

          <Image
            style={{ height: 20, width: 20 }}
            source={require('../src/assets/google.png')}
          />
        </View>
        <Text>Google SignIn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginVertical: 12, paddingVertical: 10, backgroundColor: "#cdcdcd", alignItems: "center", justifyContent: "center", width: "100%", flexDirection: "row",borderRadius:8 }}
        onPress={() => faceBookSignin()}
      >
        <View style={{ marginRight: 15 }}>

          <Image
            style={{ height: 20, width: 20 }}
            source={require('../src/assets/FB.png')}
          />
        </View>
        <Text>FaceBook SignIn</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginVertical: 12, paddingVertical: 10, backgroundColor: "#cdcdcd", alignItems: "center", justifyContent: "center", width: "100%", flexDirection: "row",borderRadius:8 }}
        // onPress={() => faceBookSignin()}
      >
        <View style={{ marginRight: 15 }}>

          <Image
            style={{ height: 20, width: 20 }}
            source={require('../src/assets/appleIcon.png')}
          />
        </View>
        <Text>Login with Apple</Text>
      </TouchableOpacity>
    </>

  )
}

export default socialMedia

const styles = StyleSheet.create({})