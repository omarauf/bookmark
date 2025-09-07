import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

function App() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <div className="fixed right-0 bottom-0 z-10 m-5 flex select-none items-end leading-4">
      {show && (
        <div
          className={`mx-2 h-fit w-fit rounded-2xl bg-white px-6 py-2 text-black transition-all ${show ? "opacity-100" : "opacity-0"}`}
        >
          <h1 className="">HELLO CRXJS</h1>
        </div>
      )}
      <Button size="icon" onClick={toggle}>
        X
      </Button>
    </div>
  );
}

export default App;
