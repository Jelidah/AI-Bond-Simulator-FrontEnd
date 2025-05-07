import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';

type Props = {
    children: React.ReactNode;
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 200,
        backgroundColor: '#004080',
        padding: 16,
    },
    sidebarTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    sidebarItem: {
        marginBottom: 16,
    },
    sidebarItemText: {
        color: '#fff',
        fontSize: 16,
    },
    main: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#004080', // ← matched to sidebar
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    footer: {
        padding: 12,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#888',
    },
});

export default function AppLayout({ children }: Props) {
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>📊 Simulator</Text>
                    <TouchableOpacity style={styles.sidebarItem}>
                        <Link href="/" asChild>
                            <Text style={styles.sidebarItemText}>🏠 Home</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
                <View style={styles.main}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Bond Investment Analysis Tool</Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.content}>
                        {children}
                    </ScrollView>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © {new Date().getFullYear()} Pynecot AI Finance
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
