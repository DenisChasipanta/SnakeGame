import { TouchableOpacity, StyleSheet, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons"

import {FontAwesome} from "@expo/vector-icons"
import { Children } from "react";
import { Colors } from '../../../theme/colors';

interface HeaderProps{
    reloadGame: ()=> void;
    puseGame: ()=> void;
    children:boolean;
    isPaused: boolean;
}
export default function Header({
    children,
    reloadGame,
    puseGame,
    isPaused,
}:HeaderProps):JSX.Element{
    return(
        <View style={Styles.container}>
            <TouchableOpacity onPress={reloadGame}>
                <Ionicons name='reload-circle' size={35} color={Colors.primary}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={puseGame}>
                <FontAwesome
                name={isPaused ? "play-circle" : "pause-circle"}
                size={35}
                color={Colors.primary}
                />
            </TouchableOpacity>
            {children}
        </View>
    )
}

const Styles = StyleSheet.create({
    container:{
        flex:0.05,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        borderColor:Colors.primary,
        borderWidth: 12,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        borderBottomWidth:0,
        padding: 15,
        backgroundColor: Colors.background,
    },
});