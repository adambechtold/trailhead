import Navigate from "@/components/Navigate";

import CreatePinContextProvider from "@/contexts/CreatePinContext";

export default function NavigatePage() {
  return (
    <>
      <CreatePinContextProvider>
        <Navigate />
      </CreatePinContextProvider>
    </>
  );
}
