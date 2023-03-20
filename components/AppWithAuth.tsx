import { useSession } from 'next-auth/react';

import { LoggedInLayout } from '@/layouts/LoggedIn';
import { LoggedOutLayout } from '@/layouts/LoggedOut';

/**
 * Renders a layout depending on the result of the useAuth hook
 */
export function AppWithAuth({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session?.user) return <LoggedInLayout>{children}</LoggedInLayout>;

  return <LoggedOutLayout>{children}</LoggedOutLayout>;
}
