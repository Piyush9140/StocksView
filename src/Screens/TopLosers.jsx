import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable,Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const TopLosers = () => {
    const navigation =useNavigation();
    const [gainersData, setGainersData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchData();
      console.log('hi');
    }, []);
  
    const fetchData = async () => {
      try {
        const response1 = await axios.get(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=WYCER3FYLPVKTHXE`);
        console.log(response1.data.top_losers);
        const topGainers = response1.data.top_losers;
        if (!topGainers || topGainers.length === 0) {
          throw new Error('No top losers data available');
        }
  
        setGainersData(topGainers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    const renderItem = ({ item }) => (
      <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Details Screen', { Symbol: item.ticker, Price: item.price, percentage: item.change_percentage })}>
        {/* <Image alt='symbol'> </Image> */}
        <Text style={[styles.itemText,{color:'black'}]}> {item.ticker}</Text>
        <Text style={styles.itemText}> ${item.price}</Text>
        <Text style={[styles.itemText,{color:'red'}]}> {item.change_percentage}</Text>
      </Pressable>
    );
  
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={gainersData}
            renderItem={renderItem}
            keyExtractor={(item) => item.ticker}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor:'white'
    },
    row: {
      flex: 1,
      justifyContent: 'space-around',
    },
    itemContainer: {
      flex: 1,
      margin: 5,
      padding: 10,
      backgroundColor: 'white',
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    itemText: {
      fontSize: 16,
      marginBottom: 5,
    },
  });
  

export default TopLosers;
