import React from "react";
import { useRouter } from "next/router";

import Button from "./Button/Button";
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
    <Button onClick={handleHelpClick} type="opaque" size="medium" isElevated>
      <QuestionIcon />
    </Button>
  );
}
