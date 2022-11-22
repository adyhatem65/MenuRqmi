import React, { useState } from 'react';
import { Easing, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './../store/auth'
import API from "./../services/api"
import User from './../services/user';


import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Language } from '../constants'
import config from '../config';

//Stacks
import PublicAppStack from './VendorStacks/PublicAppStack';
import AuthenticatedAppStack from './VendorStacks/AuthenticatedAppStack';

const Stack = createStackNavigator();


export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      config.DRIVER_APP = false;
      config.VENDOR_APP = true;

      try {
        userToken = await AsyncStorage.getItem('token');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        API.loginUser(data.email, data.password, data.expoPushToken, (responseJson) => {
          console.log(JSON.stringify(responseJson));
          if (responseJson.status) {
            //User ok
            console.log('login : ', responseJson)
            User.setLoggedInUser(responseJson, () => {
              data.toastok.current.show(Language.userIsNowLoggedIn, 2000, () => {
                dispatch({ type: 'SIGN_IN', token: responseJson.token });
              });

            })
          } else {
            //Not ok
            data.toasterror.current.show(responseJson.message ? responseJson.message : responseJson.errMsg, 2000, () => { });
          }
        });
      },
      signOut: async data => {
        User.logout(async () => {
          dispatch({ type: 'SIGN_OUT' })
          await AsyncStorage.setItem('res_data', '')
        })
      },
      signUp: async (data,callback) => {


        API.registerUser(data.name, data.vendor_name,data.email, data.password, data.phone, async (responseJson) => {
          // console.log("amed=============", responseJson);
          if (responseJson.status) {
            //User ok - but needs admin approval
            User.logout(() => {

              dispatch({ type: 'SIGN_OUT' })
              data.toastok.current.show(Language.VendorCreated, 2000, () => callback());

            })



          } else {
            // Not ok

            console.log(JSON.stringify(responseJson))

            const delay = async (ms = 1000) =>
              new Promise(resolve => setTimeout(resolve, ms))

            for (const key in responseJson) {

              data.toasterror.current.show(responseJson[key][0], 2000, () => { });
              await delay(1500)

            }

          }




        });



      },
    }),
    []
  );



  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="App" options={{}} component={state.userToken == null ? PublicAppStack : AuthenticatedAppStack} />
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}





