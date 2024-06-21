import React, { useState } from 'react'
import { View } from 'react-native'
import { styles } from '../theme/styles'
import { Button, Snackbar, Text, TextInput } from 'react-native-paper'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

//Interface - Formulario Login
interface FormLogin {
    email: string;
    password: string;
}

//Interface - mensajes
interface MessageSnackBar {
    visible: boolean;
    message: string;
    color: string;
}


export const LoginScreen = () => {
    //hook useState: formulario de incio sesión
    const [formLogin, setFormLogin] = useState<FormLogin>({
        email: "",
        password: ""
    });

    //hook useState: visualizar u ocultar mensaje 
    const [showMessage, setShowMessage] = useState<MessageSnackBar>({
        visible: false,
        message: '',
        color: '#fff'
    });

    //hook useState: visualizar password
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

    //Hook useNavigation: navegar entre screens
    const navigation = useNavigation();

    //Función que cambie los valores del formRegister
    const handlerSetValues = (key: string, value: string) => {
        // operador spread: ... sacar una copia superficial de un objeto
        setFormLogin({ ...formLogin, [key]: value });
    }

    const handlerLogin = async () => {
        if (!formLogin.email || !formLogin.password) {
            setShowMessage({
                visible: true,
                message: "Completa todos los campos!",
                color: '#b53333'
            })
            return;
        }
        //console.log(formLogin);
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                formLogin.email,
                formLogin.password
            );
            navigation.dispatch(CommonActions.navigate({ name: 'Home' }));
            //console.log(response);
        } catch (ex) {
            console.log(ex);
            setShowMessage({
                visible: true,
                message: "Usuario y/o contraseña incorrecta!",
                color: '#b53333'
            })
        }
    }

    return (
        <View style={styles.root}>
            <Text style={styles.textHead}>SNAKE GAME</Text>
            <TextInput
                mode='outlined'
                label='Correo'
                placeholder='Escriba su correo'
                style={styles.inputs}
                onChangeText={(value) => handlerSetValues('email', value)}
            />
            <TextInput
                mode='outlined'
                label='Contraseña'
                placeholder='Escriba su contraseña'
                secureTextEntry={hiddenPassword}
                right={<TextInput.Icon icon="eye"
                    onPress={() => setHiddenPassword(!hiddenPassword)} />}
                style={styles.inputs}
                onChangeText={(value) => handlerSetValues('password', value)}
            />
            <Button style={styles.button} mode="contained" onPress={handlerLogin}>
                Iniciar
            </Button>
            <Text
                style={styles.textRedirect}
                onPress={() => navigation.dispatch(CommonActions.navigate({ name: "Register" }))}>
                No tienes una cuenta? Regístrate ahora
            </Text>
            <Snackbar
                visible={showMessage.visible}
                onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                style={{ backgroundColor: showMessage.color }}>
                {showMessage.message}
            </Snackbar>
        </View>
    )
}