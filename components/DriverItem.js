import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { theme } from 'galio-framework';
import Theme from '../constants/Theme';

import { SIZES } from '../constants';

import Icon from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window')

const imageSize = 60;
const imageLoading = "https://www.citypng.com/public/uploads/preview/loading-load-icon-transparent-png-11639609114lctjenyas8.png";
const defaultImage = "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
const DriverItem = ({ item, index, selected, onPress }) => {
    // states
    const [validImage, setValidImage] = useState(true);

    return (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.5}>
            <View style={styles.left}>
                <Image defaultSource={{ uri: imageLoading }}
                    source={{ uri: item?.image && validImage ? item?.image : defaultImage }}
                    style={styles.image}
                    onError={() => setValidImage(false)} />
            </View>
            <View style={styles.center}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPhone}>{item.phone}</Text>
            </View>
            <View style={styles.right}>
                {selected && (
                    <Icon name='checkcircle' size={SIZES.icon} color={Theme.COLORS.SUCCESS} />
                )}
            </View>
        </TouchableOpacity>
    );
}

export default DriverItem;

const styles = StyleSheet.create({
    itemContainer: {
        width: '90%',
        height: 100,
        padding: theme.SIZES.BASE,
        backgroundColor: Theme.COLORS.WHITE,
        borderRadius: SIZES.smSpace,
        elevation: 2,
        alignSelf: 'center',
        marginBottom: SIZES.space,
        flexDirection: 'row',
        alignItems: 'center'
    },
    left: {
        // backgroundColor: '#f00',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginRight: SIZES.space
    },
    center: {
        flex: 1,
        // backgroundColor: '#ff0',
        // maxWidth: '60%',
        justifyContent: "center"
    },
    right: {
        // backgroundColor: '#f00',
        marginLeft: SIZES.space
    },
    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: imageSize / 2
    },
    itemName: {
        fontSize: SIZES.font,
        color: Theme.COLORS.BLACK,
        marginBottom: SIZES.smSpace
    },
    itemPhone: {
        fontSize: SIZES.smFont,
        color: Theme.COLORS.MUTED
    }
});