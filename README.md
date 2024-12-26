# social-media-login-component

<b>social-media-login</b> library provides an interface to providers with support for the following providers for React Native apps:

1.Google
2.Facebook
3.Apple
 

## Table of Content

- [Features](#features)
- [Installation](#installation)
- [API reference](#api-reference)
- [Google_signIn](#Google_signIn)
- [Facebook_signIn](#Facebook_signIn)
- [Apple_signIn](#Apple_signIn)

## Features

- Works for different platforms like Google, Facebook and Apple
- Easy to access SignIn inside React component
- Easy to use elements as other React Native elements

## Installation

To use this specific component first you will need to setup [firebase](https://rnfirebase.io/) into your project
you can take reference from given link
```
https://rnfirebase.io/
```

After setting up Firebase , you must set up for [google-signin](https://rnfirebase.io/auth/social-auth), You can reference from given link
```
https://rnfirebase.io/auth/social-auth
```

To add the social-media-login-component to React Native app, run this command with tag version

```
npm install https://github.com/CraftCodersInfotech/social-media-login-component.git
```

Make sure to install pod into react-native Project after linking given command

## API reference

### SocialMedia

| Name                  | Type              | Description                      |
| :-------------------- | :---------------- | :------------------------------- |
| size                 | number (Required) | size of checkbox                  |
| unbackgroundColor | string          | Color of checkbox when not check |
| selectedbackgroundColor | string            | Color of checkbox while check  |
| label        | string     | label of checkbox             |
| labelStyle             | ViewStyle     | Style of checkbox label          |
| tintColor             | string         | color of checkbox image          |
| value        | boolean     | The value of the checkbox. If true the checkbox will be turned on. Default value is false.|
| labelDirectionLeft        | boolean     |  Direction of checkbox labeltext|
| labelDirectionTop             | boolean     | Direction of checkbox labeltext          |

## Example

```javascript
import { StyleSheet, View } from 'react-native'
import React  from 'react'
import SocialMedia from 'social-media-login'
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const App = () => {
  GoogleSignin.configure({
     webClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",    
     //You can get werClientId from android/app/google-service.json
  });
   
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <SocialMedia/>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})

```


