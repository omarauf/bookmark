import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";

type Props = {
  username: string;
};

export function Action({ username }: Props) {
  const navigate = useNavigate({ from: "/instagram" });

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => {
          navigate({ search: { username } });
        }}
      >
        User
      </Button>
    </div>
  );
}
