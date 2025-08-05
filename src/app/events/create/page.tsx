
import type { Metadata } from 'next';
import { EventCodeGenerator } from '@/components/events/event-code-generator';

export const metadata: Metadata = {
    title: 'Event Code Generator',
    robots: {
        index: false,
        follow: false,
    },
};

export default function EventGeneratorPage() {
    return (
        <div className="bg-secondary/50">
            <EventCodeGenerator />
        </div>
    );
}
