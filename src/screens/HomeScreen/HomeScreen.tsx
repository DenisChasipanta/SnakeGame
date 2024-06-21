import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from '../../theme/styles';
import { auth, dbRealTime } from '../../configs/firebaseConfig';
import { signOut, updateProfile, User } from 'firebase/auth';
import { FlatList } from 'react-native-gesture-handler';
import { onValue, ref, set } from 'firebase/database';
import { CommonActions, useNavigation, NavigationProp } from '@react-navigation/native';

// Define the type for the navigation prop
type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Game: undefined;
};

type NavigationProps = NavigationProp<RootStackParamList>;

// Interface - data usuario
interface FormUser {
    name: string;
    phoneNumber: string;
}

// Interface - puntuación del juego
interface GameScore {
    score: number;
    date: string;
}

export const HomeScreen = () => {
    const [formUser, setFormUser] = useState<FormUser>({
        name: '',
        phoneNumber: ''
    });

    const [userAuth, setUserAuth] = useState<User | null>(null);

    useEffect(() => {
        setUserAuth(auth.currentUser);
        setFormUser({
            name: auth.currentUser?.displayName ?? "",
            phoneNumber: "" 
        });
    }, []);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalGame, setShowModalGame] = useState<boolean>(false);
    const [scores, setScores] = useState<GameScore[]>([]);

    const navigation = useNavigation<NavigationProps>();

    const handlerSetValues = (key: keyof FormUser, value: string) => {
        setFormUser(prevState => ({ ...prevState, [key]: value }));
    };

    const handlerUpdateUser = async () => {
        if (userAuth) {
            await updateProfile(userAuth, {
                displayName: formUser.name
            });
            setShowModal(false);
        }
    };

    const navigateToGame = () => {
        setShowModalGame(false);
        navigation.navigate('Game');
    };

    const saveGameScore = async (score: number) => {
        if (userAuth) {
            const dbRef = ref(dbRealTime, 'scores/' + userAuth.uid);
            const newScoreRef = ref(dbRealTime, Date.now().toString());
            await set(newScoreRef, {
                score,
                date: new Date().toISOString()
            });
        }
    };

    const handlerSignOut = async () => {
        await signOut(auth);
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
        setShowModal(false);
    }

    return (
        <>
            <View style={styles.rootHome}>
                <View style={styles.header}>
                    <Avatar.Text size={50} label="MI" />
                    <View>
                        <Text variant='bodySmall'>Bienvenid@</Text>
                        <Text variant='labelLarge'>{userAuth?.displayName}</Text>
                    </View>
                    <View style={styles.iconEnd}>
                        <IconButton
                            icon="account-edit"
                            mode="contained"
                            size={32}
                            onPress={() => setShowModal(true)}
                        />
                    </View>
                </View>
                <View>
                    <FlatList
                        data={scores}
                        renderItem={({ item }) => (
                            <View>
                                <Text>Score: {item.score}</Text>
                                <Text>Date: {item.date}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
            <Portal>
                <Modal visible={showModal} contentContainerStyle={styles.modal}>
                    <View style={styles.header}>
                        <Text variant='headlineMedium'>Mi Perfil</Text>
                        <View style={styles.iconEnd}>
                            <IconButton
                                icon="close-circle-outline"
                                size={28}
                                onPress={() => setShowModal(false)}
                            />
                        </View>
                    </View>
                    <Divider />
                    <TextInput
                        mode='outlined'
                        label='Ingrese su nombre de ususario'
                        value={formUser.name}
                        onChangeText={(value) => handlerSetValues('name', value)}
                    />
                    <TextInput
                        mode='outlined'
                        label='Número de teléfono'
                        value={formUser.phoneNumber}
                        onChangeText={(value) => handlerSetValues('phoneNumber', value)}
                    />
                    <TextInput
                        mode='outlined'
                        label='Correo'
                        value={userAuth?.email ?? ""}
                        disabled
                    />
                    <Button mode='contained' onPress={handlerUpdateUser}>Actualizar</Button>
                    <View style={styles.iconSignOut}>
                        <IconButton
                            icon="logout"
                            size={35}
                            mode='contained'
                            onPress={handlerSignOut}
                        />
                    </View>
                </Modal>
            </Portal>
            <FAB
                icon="plus"
                style={styles.fabMessage}
                onPress={() => setShowModalGame(true)}
            />
            <Portal>
                <Modal visible={showModalGame} contentContainerStyle={styles.modal}>
                    <View style={styles.header}>
                        <Text variant='headlineMedium'>Iniciar Juego</Text>
                        <View style={styles.iconEnd}>
                            <IconButton
                                icon="close-circle-outline"
                                size={28}
                                onPress={() => setShowModalGame(false)}
                            />
                        </View>
                    </View>
                    <Divider />
                    <Button mode='contained' onPress={navigateToGame}>Jugar</Button>
                </Modal>
            </Portal>
        </>
    );
};
