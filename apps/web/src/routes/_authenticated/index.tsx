import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Main } from "@/layout/main";

export const Route = createFileRoute("/_authenticated/")({ component: App });

function App() {
  return (
    <Main>
      <h1 className="font-medium">Project ready!</h1>
      <p>You may now add components and start building.</p>
      <p>We&apos;ve already added the button component for you.</p>
      <Button className="mt-2">Button</Button>
    </Main>
  );
}
