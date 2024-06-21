import { Fragment } from "react";
import { View,StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Coordinate } from "../../../types/types";


interface SnakePops{
    snake: Coordinate[];
}
export default function Snake({snake}:SnakePops):JSX.Element{
    return <Fragment>
        {snake.map((segment: any, index: number) =>{
            const segmentStyle={
                left: segment.x * 10,
                top: segment.y * 10,
            }
            return <View key={index} style={[styles.snake,segmentStyle]}/>
        })}
    </Fragment>
}
const styles= StyleSheet.create({
    snake: {
        width:15,
        height:15,
        borderRadius:7,
        backgroundColor: Colors.primary,
        position: 'absolute',
    }
})