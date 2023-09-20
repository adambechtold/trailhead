import React from "react";
import { useRouter } from "next/router";

import ClearButton from "./ClearButton/ClearButton";
import { QuestionIcon } from "./Icons/Icons";

export default function HelpButton() {
  const router = useRouter();

  const handleHelpClick = () => {
    router.push({
      pathname: "/how-to-use",
      query: { disclaimer: "false" },
    });
  };

  return (
    <ClearButton onClick={handleHelpClick}>
      <QuestionIcon />
    </ClearButton>
  );
}
