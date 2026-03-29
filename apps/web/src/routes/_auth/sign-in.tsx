import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "@/components/form";
import { authClient } from "@/integrations/auth";

export const Route = createFileRoute("/_auth/sign-in")({
  beforeLoad: async ({ context: { userSession } }) => {
    if (userSession) throw redirect({ to: "/" });
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
    <div className="mx-auto mt-4 flex w-full flex-col items-center md:mt-20">
      <div className="wrapper">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-background p-6 shadow md:p-8">
          <p className="text-center font-bold text-xl">Log in</p>

          <form onSubmit={onSubmitHandler} className="mt-8 space-y-4">
            <form.AppField name="email">
              {(field) => <field.Input placeholder="Email" />}
            </form.AppField>

            <form.AppField name="password">
              {(field) => <field.Password placeholder="Password" />}
            </form.AppField>

            <form.AppForm>
              <form.SubmitButton className="mt-8 w-full py-6 font-bold text-primary">
                Sign in
              </form.SubmitButton>
            </form.AppForm>
          </form>
        </div>
      </div>
    </div>
  );
}
