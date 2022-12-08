import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"

const socialMedia = () => {
  useEffect(() => {
    GoogleSignin.configure()
  }, [])
  
  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info",userInfo);
      
    } catch (error:any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
      } else {
        console.log(error);
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