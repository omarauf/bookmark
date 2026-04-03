import { useStore } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "../context";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export function SubmitButton({ children, variant, className }: SubmitButtonProps) {
  const form = useFormContext();

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <Button
      type="submit"
      className={className}
      variant={variant}
      disabled={isSubmitting || !canSubmit}
    >
      {isSubmitting && <Loader className="animate-spin" />}
      {children}
    </Button>
  );
}
