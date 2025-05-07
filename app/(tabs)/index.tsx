import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import axios from 'axios';

const EXCHANGE_RATE = 28;

export default function HomeScreen() {
    const [inputs, setInputs] = useState({
        monthly_investment: '',
        investment_years: '',
        bond_tenor_years: '',
        start_year: '',
        start_month: '',
    });

    const [usedInputs, setUsedInputs] = useState<typeof inputs | null>(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        total_invested: number;
        total_interest: number;
        duration_months: number;
        excel_url?: string;
    } | null>(null);

    const handleChange = (field: string, value: string) => {
        setInputs({ ...inputs, [field]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'http://192.168.12.170:8000/api/simulate/',
                inputs
            );
            setResult(response.data.summary);
            setUsedInputs(inputs); // Save the current inputs before clearing
            Alert.alert('✅ Success', 'Simulation complete.');

            setInputs({
                monthly_investment: '',
                investment_years: '',
                bond_tenor_years: '',
                start_year: '',
                start_month: '',
            });
        } catch (error) {
            console.error(error);
            Alert.alert('❌ Error', 'Failed to simulate. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenExcel = () => {
        if (result?.excel_url) {
            if (Platform.OS === 'web') {
                window.open(result.excel_url, '_blank');
            } else {
                Alert.alert(
                    'Not supported',
                    'Opening files is only supported on web for now.'
                );
            }
        } else {
            Alert.alert('Error', 'No Excel file available.');
        }
    };

    const formatNumber = (num: number) =>
        num.toLocaleString(undefined, { minimumFractionDigits: 2 });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>📈 Bond Investment Simulator</Text>

            {Object.entries(inputs).map(([key, value]) => (
                <TextInput
                    key={key}
                    placeholder={key.replace(/_/g, ' ')}
                    value={value}
                    onChangeText={(text) => handleChange(key, text)}
                    keyboardType="numeric"
                    style={styles.input}
                />
            ))}

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
            ) : (
                <Button title="Run Simulation" onPress={handleSubmit} />
            )}

            {result && usedInputs && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>🧠 Investment Summary</Text>
                    <Text style={{ marginBottom: 8 }}>
                        If you invest{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            ZMW {parseFloat(usedInputs.monthly_investment).toLocaleString()}
                        </Text>{' '}
                        per month (approx.{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            $
                            {(
                                parseFloat(usedInputs.monthly_investment) / EXCHANGE_RATE
                            ).toFixed(2)}
                        </Text>{' '}
                        USD), for{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            {usedInputs.investment_years} year(s)
                        </Text>{' '}
                        into a{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            {usedInputs.bond_tenor_years}-year bond
                        </Text>{' '}
                        starting in {usedInputs.start_year}, you will invest a total of approx.{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            ${formatNumber(result.total_invested / EXCHANGE_RATE)}
                        </Text>{' '}
                        and earn approx.{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            ${formatNumber(result.total_interest / EXCHANGE_RATE)}
                        </Text>{' '}
                        in interest coupons.
                    </Text>

                    <Text style={styles.resultTitle}>💵 Simulation Summary (in USD)</Text>
                    <Text>Total Invested: ${formatNumber(result.total_invested / EXCHANGE_RATE)}</Text>
                    <Text>Total Interest: ${formatNumber(result.total_interest / EXCHANGE_RATE)}</Text>
                    <Text>Duration: {result.duration_months} months</Text>

                    {result.excel_url && (
                        <View style={{ marginTop: 16 }}>
                            <Button title="📄 See Full Simulation" onPress={handleOpenExcel} />
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#f8f8f8',
    },
    resultBox: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#eafbea',
        borderRadius: 8,
    },
    resultTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },
});
