import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
import { SigninContext } from "./context"

const socialMedia = () => {
  const { registerUser, userData } = useContext<any>(SigninContext);
  useEffect(() => {
    GoogleSignin.configure()
  }, [])
  
  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await registerUser(userInfo);
      console.log("user info",userInfo);
      
    } catch (error:any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("error1",error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("error2",error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("error3",error);
      } else {
        console.log("error4",error);
      }
    }
  };
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <TouchableOpacity style={{height:35,backgroundColor:"#cdcdcd",alignItems:"center",justifyContent:"center",width:100}}
      onPress={()=>googleSignin()}>
      <Text>Google SignIn</Text>
      </TouchableOpacity>
    </View>
  )
}

export default socialMedia

const styles = StyleSheet.create({})