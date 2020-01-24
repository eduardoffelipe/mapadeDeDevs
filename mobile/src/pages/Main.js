import React from 'react'
import { useEffect, useState } from 'react'
import MapView, { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Dimensions,Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons' 
import api from '../services/api'


function Main({ navigation }){
  const [devs, setDevs] = useState([])
  const [currentRegion, setCurrentRegion] = useState(null)
  const [techs, setTechs] = useState('')

  useEffect(()=>{
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if(granted){
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        })

        const {latitude,longitude} = coords
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03 ,
        })

      }
    }

    loadInitialPosition();
    
  },[])

  function handleRegionChanged(region){
    setCurrentRegion(region)
  }

  async function loadDevs(){
    const {latitude, longitude} = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs, 
      }
    })

    setDevs(response.data.devs)
  }

  if(!currentRegion){
    return null
  }

  return (
    
    <>
      <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.mapStyle}>
      {devs.map(dev => (
                <Marker key={dev._id} coordinate={{latitude:dev.location.coordinates[1], longitude:dev.location.coordinates[0]}}>
                  <Image style={styles.avatar} source={{uri: dev.avatar_url}} />
                  <Callout onPress={() => {
                    //navegação
                    navigation.navigate('Profile', {github_username: dev.github_username})
                  }}>
                    <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                    </View>
                  </Callout>
        
              </Marker>
      ))}
      </MapView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="60">
        <View style={styles.searchForms}>
          
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar devs por techs"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={techs}
            onChangeText={text => setTechs(text)}  
          />

          <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
            <MaterialIcons name="my-location" size={20} color="#fff"></MaterialIcons>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </>

  )
}

const styles = StyleSheet.create({

  mapStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  avatar:{
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#FFF'
  },
  callout: {
    width: 260,
  },
  devName:{
    fontWeight: "bold",
    fontSize: 16,
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs:{
    marginTop: 5
  },
  searchForms: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection:'row',  
  },
  searchInput:{
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color:'#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity:0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  }
});

export default Main;