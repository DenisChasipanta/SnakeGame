import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { styles } from "../theme/styles";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen/HomeScreen";
import { auth } from "../configs/firebaseConfig";




const Stack = createStackNavigator();

//Interface - Rutas
interface Routes {
    name: string;
    screen: () => JSX.Element; //elemento jsx
    headerShow?: boolean;
}

//Arreglo que contenga las rutas si el usuario no está autenticado
const routes: Routes[] = [
    { name: "Login", screen: LoginScreen },
    { name: "Register", screen: RegisterScreen },
    { name: "Home", screen: HomeScreen },
    // { name: "Game", screen: Game, headerShow:true }
    
]

export const StackNavigator = () => {
    //Hook useState: verifica si está autenticado o no
    const [isAuth, setIsAuth] = useState<boolean>(false);

    //Hook useState: controlar la carga de activity
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //Hook useEffect: validar y obtener la data del usuario autenticado
    useEffect(() => {
        setIsLoading(true);
        onAuthStateChanged(auth, (user) => {
            //Si existe un usuario autenticado
            if (user) {
                //console.log(user);
                setIsAuth(true);
            }
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            {isLoading ? (
                <View style={styles.root}>
                    <ActivityIndicator size={35} />
                </View>
            ) : (
                <Stack.Navigator initialRouteName={isAuth ? 'Home' : 'Login'}>
                    {
                        routes.map((item, index) => (
                            <Stack.Screen
                                key={index}
                                name={item.name}
                                options={{ headerShown: item.headerShow ?? false }}
                                component={item.screen} />
                        ))
                    }
                </Stack.Navigator>
            )}
        </>
    );
}