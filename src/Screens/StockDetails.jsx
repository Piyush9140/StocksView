import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const PriceRange = ({ low, high, current }) => {
    if (current < low) {
        current = low;
    }
    if (current > high) {
        current = high;
    }
    const calculatePosition = (low, high, current) => {
        const range = high - low;
        const position = ((current - low) / range) * 100;
        return position;
    };

    const currentPosition = calculatePosition(low, high, current);

    return (
        <View style={styles.priceRangeContainer}>
            <Text style={styles.priceRangeLabel}>{`52 Week Low: $${low}`}</Text>
            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <View style={[styles.currentPriceMarker, { left: `${currentPosition}%` }]}>
                    <Text style={styles.currentPriceText}>{`$${current}`}</Text>
                </View>
            </View>
            <Text style={styles.priceRangeLabel}>{`52 Week High: $${high}`}</Text>
        </View>
    );
};

const StockOverview = ({ route, navigation }) => {
    const { Symbol, Price, percentage } = route.params;

    const API_KEY = 'WYCER3FYLPVKTHXE';
    const symbol = Symbol;
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

    const ChartComponent = () => {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(apiUrl);
                    const jsonData = await response.json();
                    const timeSeriesData = jsonData['Time Series (Daily)'];

                    // Extracting dates and closing prices
                    const dates = Object.keys(timeSeriesData).sort((a, b) => new Date(a) - new Date(b));
                    const chartData = dates.map(date => parseFloat(timeSeriesData[date]['4. close']));

                    // Reverse data to display in chronological order
                    setData(chartData.reverse());
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            };

            fetchData();
        }, []);

        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }

        const contentInset = { top: 20, bottom: 20 };

        return (
            <View style={{ flex: 1, flexDirection: 'row', height: 250 }}>
                <YAxis
                    data={data}
                    contentInset={contentInset}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={10}
                    formatLabel={(value) => `$${value}`}
                />

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={data}
                        contentInset={contentInset}
                        curve={shape.curveNatural}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid />
                    </LineChart>
                </View>
            </View>
        );
    };
    const price = parseFloat(Price);
    console.log(price)
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverviewData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://www.alphavantage.co/query', {
                    params: {
                        function: 'OVERVIEW',
                        symbol: symbol,
                        apikey: API_KEY,
                    },
                });
                setOverviewData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOverviewData();
    }, [Symbol]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!overviewData) {
        return <Text>No data available</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.symbol}>{overviewData.Symbol}</Text>
                    <Text style={styles.name}>{overviewData.Name}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.price}>${price} <Text style={{ color: percentage[0] != '-' ? 'green' : 'red' }}>{percentage}</Text></Text>
                </View>
            </View>
            <ChartComponent />

            {/* Description Section */}
            <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>About {overviewData.Symbol}</Text>
                <Text style={styles.descriptionText}>{overviewData.Description}</Text>
            </View>

            {/* Industry and Sector Section */}
            <View style={styles.industrySectorSection}>
                <View style={styles.ovalContainer}>
                    <Text style={styles.ovalText}>Industry: {overviewData.Industry}</Text>
                </View>
                <View style={styles.ovalContainer}>
                    <Text style={styles.ovalText}>Sector: {overviewData.Sector}</Text>
                </View>
            </View>

            {/* Price Range Section */}
            <PriceRange
                low={parseFloat(overviewData['52WeekLow'])}
                high={parseFloat(overviewData['52WeekHigh'])}
                current={parseFloat(price)}
            />

            {/* Key Statistics Section */}
            <View style={styles.statsSection}>
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsLabel}>Market Cap</Text>
                        <Text style={styles.statsValue}>{overviewData.MarketCapitalization}</Text>
                    </View>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsLabel}>P/E Ratio</Text>
                        <Text style={styles.statsValue}>{overviewData.PERatio}</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsLabel}>Beta</Text>
                        <Text style={styles.statsValue}>{overviewData.Beta}</Text>
                    </View>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsLabel}>Dividend Yield</Text>
                        <Text style={styles.statsValue}>{overviewData.DividendYield}</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsLabel}>Profit Margin</Text>
                        <Text style={styles.statsValue}>{overviewData.ProfitMargin}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flex: 1,
    },
    symbol: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 16,
        color: '#666',
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    descriptionSection: {
        marginBottom: 20,
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#f5f5f5'

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    industrySectorSection: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    ovalContainer: {
        backgroundColor: '#FBCEB1',
        borderRadius: 20,
        marginBottom: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    ovalText: {
        fontSize: 16,
        color: '#8A3324',
        fontWeight: '500'
    },
    priceRangeContainer: {
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    priceRangeLabel: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    lineContainer: {
        position: 'relative',
        height: 2,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    line: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#000',
        width: '100%',
    },
    currentPriceMarker: {
        position: 'absolute',
        top: -20,
        height: 20,
        alignItems: 'center',
    },
    currentPriceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    statsSection: {
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statsCard: {
        flex: 1,
        padding: 10,
        margin: 5,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
    },
    statsLabel: {
        fontSize: 14,
        color: '#666',
    },
    statsValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StockOverview;
