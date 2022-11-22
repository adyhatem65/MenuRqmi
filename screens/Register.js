import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Text as RNText,
  TouchableOpacity
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import config from '../config';
import { Button, Icon, Input } from "../components";
import { Images, argonTheme, Language } from "../constants";
import { AsyncStorage } from 'react-native';
import AppEventEmitter from '../functions/emitter';
const { width, height } = Dimensions.get("screen");
import API from "./../services/api"
import Toast, { DURATION } from 'react-native-easy-toast'
import User from './../services/user';
import AuthContext from './../store/auth'
import { AntDesign, FontAwesome5, Entypo } from '@expo/vector-icons'
import { ThemeProvider } from "@react-navigation/native";

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      phone: "",
      name: "",
      vendor_name: "",
      showPass: true,
      logInCorrect: true,
      email_err: '',
      pass_err: '',
      phone_err: "",
      name_err: "",
      vendor_name_err: "",
      name_suc: false,
      email_suc: false,
      phone_suc: false,
      pass_suc: false,
      vendor_name_suc: ""
    };
    this.toastok = React.createRef();
    this.toasterror = React.createRef();




  }

  validation(callback) {
    let email = this.state.email;
    let pass = this.state.password;
    let name = this.state.name;
    let vendor_name = this.state.vendor_name;
    let phone = this.state.phone;
    let errors = 0;

    //vendor name
    if (vendor_name.trim().length < 3) {
      this.setState({ vendor_name_err: Language.name_err_msg })
      errors++
    } else {
      this.setState({ vendor_name_err: "" })
    }

    //name 
    if (name.trim().length < 3) {
      this.setState({ name_err: Language.name_err_msg })
      errors++
    } else {
      this.setState({ name_err: "" })
    }

    //email
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; // asdsadsad@sadjkjshd.skldjlskjd
    if (reg.test(email.trim()) == false || email.trim().length == 0) {
      this.setState({ email_err: Language.email_err_msg });
      errors++;
    } else {
      this.setState({ email_err: '' });
    }

    // password
    if (pass.trim().length < 3 || pass.trim().length == 0) {
      this.setState({ pass_err: Language.pass_err_msg });
      errors++;
    } else {
      this.setState({ pass_err: '' });
    }

    //phone
    let regPhone = /^(\+201|01){1}[0-2,5][0-9]{8}$/;
    if (regPhone.test(phone.trim()) == false || phone.trim().length == 0) {
      this.setState({ phone_err: Language.phone_err_msg });
      errors++;
    } else {
      this.setState({ phone_err: '' });
    }

    if (errors == 0) {
      // alert('success');
      console.log("success")

      callback()
    }
  }


  //vendor name
  onEndEditingVendorName = value => {
    if (value.trim().length < 3) {
      this.setState({ vendor_name_err: Language.vendor_name_err_msg })
    } else {

      this.setState({ vendor_name_err: "", vendor_name: value, vendor_name_suc: true })
    }
  }


  //name
  onEndEditingName = value => {
    if (value.trim().length < 3) {
      this.setState({ name_err: Language.name_err_msg })
    } else {

      this.setState({ name_err: "", name: value, name_suc: true })
    }
  }

  onEndEditingEmail = value => {
    // eamil
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; // asdsadsad@sadjkjshd.skldjlskjd
    if (reg.test(value.trim()) == false && value.trim().length != 0) {
      this.setState({ email_err: Language.email_err_msg });
      return false;
    } else {

      this.setState({ email_err: '', email: value, email_suc: true });
      return true;
    }
  };

  onEndEditingPass = value => {
    // password
    if (value.trim().length < 3 && value.trim().length != 0) {
      this.setState({ pass_err: Language.pass_err_msg });
      return false;
    } else {
      this.setState({ pass_err: '', password: value, pass_suc: true });
      return true;
    }
  };


  onEndEditingMobile = value => {
    // mobile
    let reg = /^(\+201|01){1}[0-2,5][0-9]{8}$/;
    if (reg.test(value.trim()) == false && value.trim().length != 0) {
      this.setState({ phone_err: Language.phone_err_msg });
      return false;
    } else {
      this.setState({ phone_err: '', phone: value, phone_suc: true });
      return true;
    }
  };



  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>

              <Block flex>
                <Block flex={0.17} middle style={{
                  marginTop: 20, alignItems: 'center', flexDirection: 'row'


                }}>

                  <Image source={{ uri: Images.RemoteLogo }} style={{ width: (244), height: (config.LOGOHeight * (244 / config.LOGOWidth)) }} />

                  <TouchableOpacity style={{ position: "absolute", left: 15, width: 40, height: 40, justifyContent: "center" }}
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <AntDesign
                      size={25}
                      color={argonTheme.COLORS.BLACK}
                       name="arrowleft"
                      // family="ArgonExtra"
                      style={styles.inputIcons}
                    />
                  </TouchableOpacity>
                </Block>

                <Block flex center
                //  style={{ backgroundColor: "#ff0" }}
                >
                  <ScrollView showsVerticalScrollIndicator={false} >

                    <KeyboardAvoidingView
                      style={{
                        flex: 1,
                        //  backgroundColor: "#0ff"
                      }}
                      behavior="padding"
                      enabled
                    >

                      {/** Vendor name */}
                      <Block width={width * 0.8} style={{
                        marginBottom: 15,
                        //  backgroundColor: "#00f" 
                      }}>
                        <Input
                          onEndEditing={(e) => { this.onEndEditingVendorName(e.nativeEvent.text) }}
                          error={this.state.vendor_name_err}
                          success={this.state.vendor_name_suc}
                          value={this.state.vendor_name}
                          borderles

                          onChangeText={text => this.setState({
                            vendor_name: text
                          })}
                          placeholder={"Store Name"}
                          iconContent={
                            <Entypo name="shop" size={16} color={argonTheme.COLORS.BLACK} style={styles.inputIcons} />
                          }
                        />
                        {this.state.vendor_name_err ? <RNText style={styles.err_style}>{this.state.vendor_name_err}</RNText> : null}
                      </Block>


                      {/** Name */}
                      <Block width={width * 0.8} style={{
                        marginBottom: 15,
                        //  backgroundColor: "#00f" 
                      }}>
                        <Input
                          onEndEditing={(e) => { this.onEndEditingName(e.nativeEvent.text) }}
                          error={this.state.name_err}
                          success={this.state.name_suc}
                          value={this.state.name}
                          borderles

                          onChangeText={text => this.setState({
                            name: text
                          })}
                          placeholder={"Owner Name"}
                          iconContent={
                            <FontAwesome5 name="user-alt" size={16} color={argonTheme.COLORS.BLACK} style={styles.inputIcons} />

                          }
                        />
                        {this.state.name_err ? <RNText style={styles.err_style}>{this.state.name_err}</RNText> : null}
                      </Block>




                      {/**
                     * Phone
                     */}
                      <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                        <Input
                          onEndEditing={(e) => { this.onEndEditingMobile(e.nativeEvent.text) }}
                          error={this.state.phone_err}
                          success={this.state.phone_suc}
                          value={this.state.phone}
                          borderles

                          onChangeText={text => this.setState({
                            phone: text
                          })}
                          placeholder={"Phone"}
                          iconContent={
                            <FontAwesome5 name="phone-alt" size={16} color={argonTheme.COLORS.BLACK} style={styles.inputIcons}  />
                          }
                        />
                        {this.state.phone_err ? <RNText style={styles.err_style}>{this.state.phone_err}</RNText> : null}

                      </Block>

                      {/**
                     * Email
                     */}

                      <Block width={width * 0.8} style={{
                        marginBottom: 15,
                        //  backgroundColor: "#00f"
                      }}>
                        <Input
                          onEndEditing={(e) => { this.onEndEditingEmail(e.nativeEvent.text) }}
                          error={this.state.email_err}
                          success={this.state.email_suc}
                          value={this.state.email}
                          borderles

                          onChangeText={text => this.setState({
                            email: text
                          })}
                          placeholder={"Email"}
                          iconContent={
                            <Icon
                              size={16}
                              color={argonTheme.COLORS.BLACK}
                              name="ic_mail_24px"
                              family="ArgonExtra"
                              style={styles.inputIcons}
                            />
                          }
                        />
                        {this.state.email_err ? <RNText style={styles.err_style}>{this.state.email_err}</RNText> : null}

                      </Block>

                      <Block width={width * 0.8}>
                        <Input
                          onEndEditing={(e) => { this.onEndEditingPass(e.nativeEvent.text) }}
                          error={this.state.pass_err}
                          success={this.state.pass_suc}
                          value={this.state.password}
                          password
                          borderles
                          placeholder={"Password"}
                          onChangeText={text => this.setState({
                            password: text
                          })}
                          iconContent={
                            <Icon
                              size={16}
                              color={argonTheme.COLORS.BLACK}
                              name="padlock-unlocked"
                              family="ArgonExtra"
                              style={styles.inputIcons}
                            />
                          }
                        />
                        {this.state.pass_err ? <RNText style={styles.err_style}>{this.state.pass_err}</RNText> : null}

                      </Block>
                      <Block middle>
                        <AuthContext.Consumer>
                          {({ signUp }) => (
                            <Button color="WARNING" style={styles.createButton} onPress={() => this.validation(() => signUp({ email: this.state.email, vendor_name: this.state.vendor_name, password: this.state.password, name: this.state.name, phone: this.state.phone, toastok: this.toastok, toasterror: this.toasterror },
                              () => {
                                this.setState({ name: "", vendor_name: "", email: "", phone: "", password: "" })
                                this.props.navigation.navigate("Login")

                              }))}>
                              <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                {Language.register}
                              </Text>
                            </Button>
                          )}
                        </AuthContext.Consumer>

                      </Block>
                    </KeyboardAvoidingView>
                  </ScrollView>

                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
        <Toast ref={this.toastok} style={{ backgroundColor: argonTheme.COLORS.SUCCESS }} />
        <Toast ref={this.toasterror} style={{ backgroundColor: argonTheme.COLORS.ERROR }} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#FFF7E9",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    // backgroundColor: "#f00"
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 20,

  },
  err_style: {
    fontSize: 12,
    color: "#f00"
  }
});

export default Register;
