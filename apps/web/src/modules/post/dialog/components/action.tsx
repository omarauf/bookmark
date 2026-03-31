// import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type Props = {
  username: string;
};

export function Action({ username }: Props) {
  // const navigate = useNavigate({ from: "/instagram/" });

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => {
          // navigate({ search: { username } });
          console.log("Navigate to user profile with username:", username);
        }}
      >
        User
      </Button>
    </div>
  );
}
