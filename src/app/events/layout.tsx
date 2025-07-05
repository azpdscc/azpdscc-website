import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upcoming Arizona Indian Festivals & Events',
  description: 'Discover and search for upcoming Arizona Indian festivals, food fairs, and cultural events for the Phoenix Indian community and AZ Desis.',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
