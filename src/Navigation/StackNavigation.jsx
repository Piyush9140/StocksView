import { View, Text,StyleSheet,Input } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import StockOverview from '../Screens/StockDetails';
import BottomNavigation from './BottomNavigation';
import { TextInput } from 'react-native-gesture-handler';



const SearchBar = () => {
    return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder='Search'
            // value={value}
            // onChangeText={onChangeText}
            // {...props}
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        margin: 10,
      },
      input: {
        marginTop:5,
        height: 30,
        width:120,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
      },
    });
    

const Stack = createStackNavigator();
export default function StackNavigation() {
    return (
            <Stack.Navigator>
                <Stack.Screen name={'BottomNavigation'} component={BottomNavigation} options={{ headerShown: false }}/>
                <Stack.Screen name={'Details Screen'} component={StockOverview} options={{headerRight:() =><SearchBar/>}} />
            </Stack.Navigator>

    )
}


