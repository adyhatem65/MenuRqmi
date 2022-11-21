import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Dimensions, LogBox, Platform, Linking, Text as RNText, Modal, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { Block, theme, Text, } from "galio-framework";
const { height, width } = Dimensions.get('window');
import { argonTheme, Language, SIZES } from '../constants';
import config from "./../config";
import settings from "./../services/settings";
import MapView, { Marker } from 'react-native-maps';
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome5';

import Fancy from "./../components/Fancy"
import InfoBox from "../components/InfoBox"
import API from './../services/api'
import Button from "../components//Button";

import DriverItem from '../components/DriverItem';
import Theme from '../constants/Theme';
import Toast from 'react-native-easy-toast';

const searchHieght = 45;

const Drivers = ({ navigation, route }) => {

    // params
    const order_id = route?.params?.order_id
    const getOrder = route?.params?.getOrderDetails

    //  states
    const [selectedDriver, setSelectedDriver] = useState(route?.params?.driver)
    const [data_driver, setDriver_data] = useState([])
    const [driversLoading, setDriversLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false)

    // refs
    const toasterr = useRef()
    const toastok = useRef()

    // useEffect
    useEffect(() => {
        if (config.VENDOR_APP) {
            setDriversLoading(true)
            //Vendor get drivers
            API.getAllDrivers((res) => {
                console.log("res ===== ", res)
                setDriver_data(res);
                setDriversLoading(false);
            }, (error) => {
                setDriver_data([]);
                setDriversLoading(false);
                toasterr.current.show(Language.drivers_err, 2000, () => { })
            })
        }

        return () => getOrder()
    }, [])

    // functions
    // select driver to assgin him to order
    const selectDriver = (item) => {
        setSelectedDriver(item);
    }

    // refresh page to get newest drivers
    const onRefresh = () => {
        if (config.VENDOR_APP) {
            setRefreshing(true)
            //Vendor get drivers
            API.getAllDrivers((res) => {
                setDriver_data(res);
                setRefreshing(false);
            }, (error) => {
                setDriver_data([]);
                setRefreshing(false);
                toasterr.current.show(Language.drivers_err, 2000, () => { })
            })
        }
    }

    // assgin driver to order
    const assignDriver = () => {
        const data_to_send = {
            order_id,
            driver_id: selectedDriver?.id
        };

        if (config.VENDOR_APP) {
            setAssignLoading(true)
            //Vendor get drivers
            API.assignDriverToOrder(
                data_to_send
                , (res) => {
                    console.log("assgin ===== ", res)
                    toastok.current.show("Driver assgined successfully", 700, () => {
                        navigation.goBack()
                    })
                    setAssignLoading(false);
                    // getOrder()
                }, (error) => {
                    console.log("assign err == ", error)
                    setAssignLoading(false);
                    toasterr.current.show("something went wrong, please try again later", 1500, () => { })
                })
        }
    }

    return (

        <View style={styles.contanier}>
            {/* <Text>order_id : {order_id}</Text> */}

            {/* <View style={styles.search}>
                <TouchableOpacity style={styles.icon}>
                    <Icon
                        name={'search'}
                        size={20}
                        color={"#7e7e7e"}
                    />
                </TouchableOpacity>

                <TextInput
                    style={styles.TextInput}
                    placeholder="Search Driver..."
                    placeholderTextColor={Theme.COLORS.PLACEHOLDER}
                    />


            </View> */}


            {/* toast message */}
            <Toast position='top' positionValue={SIZES.space} ref={toasterr} style={{ backgroundColor: argonTheme.COLORS.ERROR, }} />
            <Toast position='top' positionValue={SIZES.space} ref={toastok} style={{ backgroundColor: argonTheme.COLORS.SUCCESS, }} />


            {driversLoading ? (
                <View style={[styles.pageCenter, { height: null, flex: 1 }]}>
                    <ActivityIndicator color={argonTheme.COLORS.WARNING} />
                </View>
            ) : (
                <FlatList
                    data={data_driver}
                    renderItem={({ item, index }) => (
                        <DriverItem item={item} index={index}
                            selected={item?.id == selectedDriver?.id}
                            onPress={() => selectDriver(item)} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.flatlistContainer}
                    ListEmptyComponent={<View style={styles.pageCenter}>
                        <Text style={styles.text}>there are no drivers</Text>
                    </View>}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}

            {selectedDriver && (
                <Button color="WARNING" style={styles.createButton} onPress={assignDriver}>
                    {assignLoading ? (
                        <ActivityIndicator color={argonTheme.COLORS.WHITE} />
                    ) : (
                        <Text bold size={14} color={Theme.COLORS.WHITE}>
                            {Language.choose_Drivers}
                        </Text>
                    )}
                </Button>
            )}

        </View>





    )


}

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
    }
    , search: {
        height: searchHieght,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Theme.COLORS.WHITE_GRAY,
        flexDirection: "row",
        borderRadius: searchHieght / 2,
        marginVertical: 10,
        width: '90%',
        alignSelf: 'center'
    },
    icon: {
        width: "10%",
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#00f",
        flexDirection: "row",
        borderRadius: 20,
    },
    item: {
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 8,
        // backgroundColor: "#000"
    },
    name: {
        fontSize: 32
    },
    TextInput: {
        width: "80%",
        height: 45,
        borderRadius: 20,
        paddingHorizontal: 5,
        margin: 5
    },
    flatlistContainer: {
        paddingTop: SIZES.space,
    },
    createButton: {
        width: "90%",
        marginTop: 25,
        marginBottom: 20,
        borderRadius: 5,
        alignSelf: "center"

    },
    pageCenter: {
        height: height * 0.8,
        width: '100%',
        alignItems: 'center',
        justifyContent: "center"
    },
    text: {
        fontSize: SIZES.font,
        color: argonTheme.COLORS.BLACK
    }
})
export default Drivers




