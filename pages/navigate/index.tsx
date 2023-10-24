import Navigate from "@/components/Navigate/Navigate";

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
