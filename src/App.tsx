import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [pokemons, setPokemons] = useState([])

    useEffect(() => {
        getCurrentLocation()
    }, [])
    
    useEffect(() => {
        axios.get("http://192.168.0.37:3000/pokemons")
        .then((response) => {
            setPokemons(response.data)
        })
        .catch(() => Alert.alert("Houve um erro ao pegar os pokemons"))
    }, [])

    async function getCurrentLocation() {
        const response = await Location.requestForegroundPermissionsAsync()

        if (response.granted === true) {

            const myLocation = await Location.getCurrentPositionAsync()

            setLatitude(myLocation.coords.latitude)
            setLongitude(myLocation.coords.longitude)

        } else {
            Alert.alert("AVISO", "Sem a permissão, não conseguimos pegar a sua localização :(")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <Text>Usando Maps</Text>

            { 
                (latitude && longitude) ? 
                (
                <MapView 
                    style={{ width: 340, height: 600 }}
                    initialRegion={{
                        latitude: -7.5529504,
                        longitude: -48.8832875,
                        latitudeDelta: 1,
                        longitudeDelta: 1
                    }}
                >
                    <Marker 
                        coordinate={{
                            latitude: -7.5529504,
                            longitude: -48.8832875
                        }}
                        title="Pokemon"
                        description="Pokemon encontrado"
                    />
                </MapView>
                ) : 
                (
                    <Text>Carregando...</Text>
                )
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
