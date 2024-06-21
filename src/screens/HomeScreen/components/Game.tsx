import { SafeAreaView, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { PanGestureHandler, GestureEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Header from './Header';
import { useEffect, useState } from 'react';
import Snake from './Snake';
import Food from './Food';
import { ref, set } from 'firebase/database';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { auth, dbRealTime } from '../../../configs/firebaseConfig';
import { Direction, Coordinate } from '../../../types/types';
import { checkFoot } from '../../../utils/checkFood';
import { checkGameOver } from '../../../utils/checkGameOver';
import { positionFood } from '../../../utils/posotionFood';

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOO_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 63 };
const MOVIE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game(): JSX.Element {
    const [direction, setDirection] = useState<Direction>(Direction.Right);
    const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
    const [food, setFood] = useState<Coordinate>(FOO_INITIAL_POSITION);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        if (!isGameOver) {
            const intervalID = setInterval(() => {
                !isPaused && moveSnake();
            }, MOVIE_INTERVAL);
            return () => clearInterval(intervalID);
        } else {
            // Guardar el puntaje en Firestore
            saveGameScore(score, userName);
        }
    }, [isGameOver, snake, isPaused]);

    const saveGameScore = async (score: number, userName: string) => {
        const userAuth = auth.currentUser;

        if (userAuth) {
            try {
                const dbRef = ref(dbRealTime, `scores/${userAuth.uid}`);
                const newScoreRef = ref(dbRealTime, `scores/${userAuth.uid}/${Date.now()}`);
                await set(newScoreRef, {
                    userName: userName,
                    score: score,
                    date: new Date().toISOString()
                });
                Alert.alert("Puntuación guardada", `¡Gracias por jugar, ${userName || 'Jugador'}!`);
            } catch (error) {
                console.error("Error saving score: ", error);
            }
        } else {
            console.error("User is not authenticated");
        }
    };

    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = { ...snakeHead };

        // Game Over
        if (checkGameOver(snakeHead, GAME_BOUNDS)) {
            setIsGameOver(true);
            return;
        }

        switch (direction) {
            case Direction.Up:
                newHead.y -= 1;
                break;
            case Direction.Dowm:
                newHead.y += 1;
                break;
            case Direction.Left:
                newHead.x -= 1;
                break;
            case Direction.Right:
                newHead.x += 1;
                break;
            default:
                break;
        }
        // Check foot
        if (checkFoot(newHead, food, 2)) {
            setFood(positionFood(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
            setSnake([newHead, ...snake]);
            setScore(score + SCORE_INCREMENT);
        } else {
            setSnake([newHead, ...snake.slice(0, -1)]);
        }
    };

    const handleGesture = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
        const { translationX, translationY } = event.nativeEvent;
        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {
                setDirection(Direction.Right);
            } else {
                setDirection(Direction.Left);
            }
        } else {
            if (translationY > 0) {
                setDirection(Direction.Dowm);
            } else {
                setDirection(Direction.Up);
            }
        }
    };

    const reloadGame = () => {
        setSnake(SNAKE_INITIAL_POSITION);
        setFood(FOO_INITIAL_POSITION);
        setIsGameOver(false);
        setScore(0);
        setDirection(Direction.Right);
        setIsPaused(false);
    };

    const pausedGame = () => {
        setIsPaused(!isPaused);
    };

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
                <Header
                    reloadGame={reloadGame}
                    isPaused={isPaused}
                    puseGame={pausedGame}
                >
                    <Text style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: Colors.primary,
                    }}>{score}</Text>
                </Header>
                <View style={styles.bondaries}>
                    <Snake snake={snake} />
                    <Food x={food.x} y={food.y} />
                </View>
                {isGameOver && (
                    <View style={styles.gameOverContainer}>
                        <Text style={styles.gameOverText}>Game Over</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese su nombre"
                            value={userName}
                            onChangeText={setUserName}
                        />
                        <Button
                            title="Guardar Puntuación"
                            onPress={() => saveGameScore(score, userName)}
                        />
                    </View>
                )}
            </SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    bondaries: {
        flex: 1,
        borderWidth: 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderColor: Colors.primary,
        backgroundColor: Colors.background,
    },
    gameOverContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        alignItems: 'center',
    },
    gameOverText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary,
    },
    input: {
        height: 40,
        borderColor: Colors.primary,
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
        textAlign: 'center',
    },
});
