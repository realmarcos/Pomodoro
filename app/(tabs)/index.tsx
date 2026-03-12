import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const [time, setTime] = useState(60);
  const [isRunning, setIsrunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (isRunning) {
      interval = setInterval(() => setTime((prevState) => prevState - 1), 1000);
    } else {
      clearInterval(interval);
      setTime(60)
    }

    return () => clearInterval(interval)

  }, [isRunning])


  function startTime() {
    setIsrunning(true);
  }

  function stopTime() {
    setTime(60);
    setIsrunning(false);
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 64, marginTop: 5 }}>Valor: {time}</Text>
      <Button title={isRunning ? "Para Tempo" : "Iniciar Tempo"} onPress={() => isRunning ? stopTime() : startTime()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
