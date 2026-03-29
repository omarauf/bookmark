import { useAuthentication } from "../../integrations/auth";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function SignedIn({ children, fallback = null }: Props) {
  const { isAuthenticated } = useAuthentication();

  if (!isAuthenticated) return fallback ? fallback : null;

  return children;
}
