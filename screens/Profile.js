import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity as RNTouchableOpacity,
  Linking,
  View,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { AntDesign } from "@expo/vector-icons";

import config from "../config";
import { Button } from "../components";
import { Images, argonTheme, Language } from "../constants";
import { HeaderHeight } from "../constants/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("screen");
import { useSharedState } from "./../store/store";
import userFunctions from "./../services/user";
import { TouchableOpacity } from "react-native-gesture-handler";
import User from "./../services/user";
var md5 = require("md5");
import AuthContext from "./../store/auth";
import { Icon } from "galio-framework";

const thumbMeasure = (width - 48 - 32) / 3;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      resData: {},
      validImage: true,
    };
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getRestaurantData = this.getRestaurantData.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
    this.getRestaurantData();
  }

  async getCurrentUser() {
    var userJSON = await AsyncStorage.getItem("user", null);
    if (userJSON !== null) {
      var parsedUser = JSON.parse(userJSON);
      this.setState({
        user: parsedUser,
      });
    }
  }

  async getRestaurantData() {
    let restaurantData = (await AsyncStorage.getItem("res_data")) ?? "{}";

    restaurantData = JSON.parse(restaurantData);

    this.setState({ resData: restaurantData });
  }

  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: "25%" }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri:
                        this.state.resData?.restorant_logo && this.state.validImage
                          ? this.state.resData?.restorant_logo
                          : Images.RemoteLogo,
                    }}
                    style={styles.avatar}
                    onError={() => this.setState({ validImage: false })}
                  />
                  <RNTouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      width: 40,
                      height: 40,
                      position: "absolute",
                      bottom: 0,
                      left: "5%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <AntDesign
                      size={25}
                      color={argonTheme.COLORS.BLACK}
                      name="arrowleft"
                    />
                  </RNTouchableOpacity>
                </Block>

                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color={argonTheme.COLORS.BLACK}>
                      {this.state.user.name}
                    </Text>
                    <Text
                      size={16}
                      color={argonTheme.COLORS.BLACK}
                      style={{ marginTop: 10 }}
                    >
                      {this.state.user.email}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>

                  <Block middle>
                    <AuthContext.Consumer>
                      {({ signOut }) => (
                        <RNTouchableOpacity
                          style={styles.logout_Button}
                          onPress={signOut}
                        >
                          <Text
                            size={16}
                            // muted
                            style={{
                              textAlign: "center",
                              color: argonTheme.COLORS.WHITE,
                            }}
                          >
                            {Language.logout}
                          </Text>
                        </RNTouchableOpacity>
                      )}
                    </AuthContext.Consumer>
                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "#FFF7E9",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
    backgroundColor: argonTheme.COLORS.WHITE
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  logout_Button: {
    width: "90%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: argonTheme.COLORS.WARNING,
  },
});

export default Profile;
