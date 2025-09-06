
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | PDSCC Events',
    default: 'Upcoming Arizona Punjabi Indian Festivals & Events | PDSCC',
  },
  description: 'Discover and search for upcoming Arizona Punjabi Indian festivals, food fairs, and cultural events for the Phoenix Punjabi Indian community and AZ Desis.',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
