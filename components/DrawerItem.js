import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Icon from "./Icon";
import argonTheme from "../constants/Theme";
import { TouchableOpacity } from "react-native-gesture-handler";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused, screen } = this.props;

    switch (screen) {
      case "Home":
        return (
          <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Notifications":
        return (

          <Ionicons
            name="notifications"
            size={19}
            color={focused ? "white" : argonTheme.COLORS.SUCCESS}
          />
        );
      case "Addresses":
        return (
          <Icon
            name="map-big"
            family="ArgonExtra"
            size={12}
            color={focused ? "white" : argonTheme.COLORS.SUCCESS}
          />
        );
      case "Orders":
        return (
          <FontAwesome5
            name="shopping-basket"
            size={15}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY} />
        );
      case "Earnings":
        return (
          <FontAwesome5
            name="money-bill-wave"
            size={15}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY} />
        );
      case "Elements":
        return (
          <Icon
            name="map-big"
            family="ArgonExtra"
            size={12}
            color={focused ? "white" : argonTheme.COLORS.ERROR}
          />
        );

      case "Articles":
        return (
          <Icon
            name="spaceship"
            family="ArgonExtra"
            size={12}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Profile":
        return (
          <FontAwesome5
            name="user-alt"
            size={15}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY} />

        );
      case "Login":
        return (
          <Icon
            name="engine-start"
            family="ArgonExtra"
            size={12}
            color={focused ? "white" : argonTheme.COLORS.WARNING}
          />
        );
      case "Account":
        return (
          <Icon
            name="calendar-date"
            family="ArgonExtra"
            size={12}
            color={focused ? "white" : argonTheme.COLORS.INFO}
          />
        );
      case "Getting Started":
        return <Icon />;
      case "Log out":
        return <Icon />;
      default:
        return null;
    }
  };

  render() {
    const { focused, title, onPress } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <TouchableOpacity style={{ height: 60 }} onPress={onPress}>
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={18}
              bold={focused ? true : false}
              color={focused ? "white" : "rgba(0,0,0,0.5)"}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>

    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14,
    alignItems: "center"
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
