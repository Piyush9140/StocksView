import * as React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TopGainers from '../Screens/TopGainers';
import TopLosers from '../Screens/TopLosers';

const Tab = createBottomTabNavigator();

function BottomNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 20 ,marginBottom:6},
                tabBarIcon: () => <View />,
                headerShown: true,
                headerTitle: 'Stock App'
            }}
        >
            <Tab.Screen
                name="Top Gainers"
                component={TopGainers}
                options={{ tabBarLabel: 'Top Gainers' }}
            />
            <Tab.Screen
                name="Top Losers"
                component={TopLosers}
                options={{ tabBarLabel: 'Top Losers' }}
            />
        </Tab.Navigator>
    );
}

export default BottomNavigation;