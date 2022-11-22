import React, { useEffect, useState } from "react";
import { useSafeArea } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { Block, Text, theme } from "galio-framework";

import appConfig from "./../app.json";
import config from "../config";

import Images from "../constants/Images";
import { DrawerItem as DrawerCustomItem } from "../components";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API from '../services/api'

const {width, height} = Dimensions.get('window')

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  screens,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const [resData, setResData] = useState({});
  const [validImage, setValidImage] = useState(true);

  useEffect(() => {
    getRestaurantData().then(data => {
      console.log('data == ', data)
      if (data?.restorant_logo) {
        setResData(data)
      } else {
        API.getRestaurantData(
          async (res) => {
            // console.log('res : ', res)
            setResData(res);
            await AsyncStorage.setItem('res_data', JSON.stringify(res))
          },
          (err) => {
            console.log('err : ', err)
          }
        );
      }
    })
  }, []);

  const getRestaurantData = async () => {
    let restaurantData = (await AsyncStorage.getItem("res_data")) ?? "{}";

    restaurantData = JSON.parse(restaurantData);

    return restaurantData
  };

  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.07} style={styles.header}>
        <Image
          source={{
            uri:
              resData?.restorant_logo && validImage
                ? resData?.restorant_logo
                : Images.RemoteLogo,
          }}
          style={{
            width: '100%',
            height: height * 0.3,
            resizeMode: 'contain'
          }}
          onError={() => setValidImage(false)}
        />
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14, }}>
        <DrawerContentScrollView
          {...rest}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                key={index}
                title={item.title}
                screen={item.link}
                focused={false}
                onPress={() => {
                  navigation.navigate(item.link);
                }}
              />
            );
          })}

          <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "100%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
            <Text
              muted
              color="#8898AA"
              style={{ marginTop: 16, marginLeft: 8 }}
            >
              v{appConfig.expo.version}
            </Text>
          </Block>
        </DrawerContentScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: width * 0.1,
    paddingVertical: theme.SIZES.BASE * 5,
    justifyContent: "center",
  },
  logo: {
    width: 487 / 2.5,
    height: 144 / 2.5,
  },
});

export default CustomDrawerContent;
