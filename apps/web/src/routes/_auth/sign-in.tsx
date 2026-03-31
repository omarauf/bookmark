import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "@/components/form";
import { authClient } from "@/integrations/auth";

export const Route = createFileRoute("/_auth/sign-in")({
  beforeLoad: async ({ context: { session } }) => {
    if (session) throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.resetQueries();
    navigate({ to: "/", replace: true });
    toast.success("Signed in successfully");
  };

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(value, {
        onSuccess,
        onError: ({ error }) => console.error(error),
      });
      return;
    },
    validators: {
      onSubmit: z.object({
        email: z.email(),
        password: z.string().min(8),
      }),
    },
  });

  const onSubmitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6 rounded-lg bg-card p-6 shadow">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-2xl tracking-tight">Welcome back</h1>
            <p className="text-balance text-muted-foreground text-sm">
              Enter your email below to login to your account
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <form.AppField name="email">
                {(field) => <field.Input placeholder="user@example.com" type="email" />}
              </form.AppField>

              <form.AppField name="password">
                {(field) => <field.Password placeholder="Password" />}
              </form.AppField>
            </div>

            <form.AppForm>
              <form.SubmitButton className="h-10 w-full px-8 font-semibold">
                Sign in
              </form.SubmitButton>
            </form.AppForm>
          </form>
        </div>
      </div>
    </div>
  );
}
