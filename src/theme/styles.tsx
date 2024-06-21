import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'green',
    },
    inputs: {
        width: '90%'
    },
    textHead: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black'
    },
    button: {
        width: '90%',
        backgroundColor: '#BAFF02'
    },
    textRedirect: {
        marginTop: 20,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FF2E02'
    },
    rootHome: {
        flex: 5,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: 'black'
    },
    header: {
        flexDirection: "row",
        gap: 15,
        alignItems: 'center'
    },
    iconEnd: {
        alignItems: 'flex-end',
        flex: 1
    },
    modal: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        gap: 10
    },
    rootMessage: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
    },
    fabMessage: {
        position: 'absolute',
        bottom: 20,
        right: 15
    },
    rootDetail: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        gap: 20
    },
    textDetail: {
        fontWeight: 'bold',
        fontSize: 18
    },
    iconSignOut: {
        marginTop: 25,
        alignItems: 'center'
    }
})