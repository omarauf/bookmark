import { ConfirmDialog } from "@/components/confirm-dialog";

// import { authClient } from "@/lib/auth-client";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  // const navigate = useNavigate();
  // const location = useLocation();

  const handleSignOut = async () => {
    // await authClient.signOut();
    // const currentPath = location.href;
    // navigate({ to: "/sign-in", search: { redirect: currentPath }, replace: true });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
