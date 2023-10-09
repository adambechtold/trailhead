import React from "react";

import logoSVG from "@/public/logo.svg";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={[styles.logo, montserrat.className].join(" ")}>
      <img src={logoSVG.src} />
      Trailhead
    </div>
  );
}
