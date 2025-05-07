import { Slot } from 'expo-router';
import AppLayout from '@/components/AppLayout';

export default function TabsLayout() {
    return (
        <AppLayout>
            <Slot />
        </AppLayout>
    );
}
