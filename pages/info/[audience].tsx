import React, { useState } from "react";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";

import InfoHeader from "@/components/InfoHeader/InfoHeader";
import Button from "@/components/Buttons/Button";
import ComparisonWithSlider from "@/components/ComparisonWithSlider/ComparisonWithSlider";

import styles from "./info.module.css";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

type Props = {
  audience: "hikers" | "trail-managers";
};

export default function InfoPage({ audience }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={[styles.container, montserrat.className].join(" ")}>
      <div className={styles.content}>
        <div className={styles["position-header"]}>
          <InfoHeader audience={audience} />
        </div>
        {audience === "hikers" ? <InfoForHikers /> : <InfoForTrailManagers />}
        <div className={styles.signature}>
          From <a href="https://www.adambechtold.xyz">Adam Bechtold</a>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const audience = context.params?.audience;
  return {
    props: {
      audience: audience,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { audience: "hikers" } },
      { params: { audience: "trail-managers" } },
    ],
    fallback: false,
  };
};

type DemoModalProps = {
  onClose: () => void;
};

function DemoModal({ onClose }: DemoModalProps) {
  return (
    <div className={styles["modal-background"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles["close-button"]} onClick={onClose}>
          &times;
        </div>
        <div className={styles["video-container"]}>
          <video controls autoPlay style={{ maxHeight: "100%" }}>
            <source src="/videos/demo-trailhead.large.mp4" type="video/mp4" />
            Your Browser Does Not Support This Video
          </video>
        </div>
      </div>
    </div>
  );
}

function InfoForHikers() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      <div className={styles["content-section"]}>
        <h1 className={"gradient-text"}>Navigate Anywhere.</h1>
        <span className={styles.subtitle}>
          Turn any picture into a GPS-enabled map.
        </span>
      </div>
      <Button
        type="gradient-primary"
        size="medium"
        onClick={() => router.push("navigate")}
      >
        Start Navigating
      </Button>
      <div className={styles["content-section"]}>
        <h2>Easy as 1, 2, 3.</h2>
        <p>Configure a trail map in 3 steps:</p>
        <ol>
          <li>📸 Take a Picture of a Trail Map</li>
          <li>📍 Pin Your Current Location</li>
          <li>📍 Pin One Other Location</li>
        </ol>
        <div className={styles["demo-container"]}>
          <Button
            type="gradient-secondary"
            size="medium"
            onClick={() => setShowDemo(true)}
          >
            Watch the Demo
          </Button>
        </div>
      </div>
      <div className={styles["content-section"]}>
        <h2>No Service? No Problem.</h2>
        <p>
          Trailhead is completely offline. No need to download anything before
          you hit the trail.
        </p>
        <p>Take a picture of the trail map and off you go.</p>
      </div>
      <div className={styles["content-section"]}>
        <h2>Discover Everything.</h2>
        <p>Local maps contain far more information than generic trail apps.</p>
        <p>
          Find scenic lookouts, trail colors, and property boundaries that
          AllTrails and Gaia leave behind.
        </p>
        <div className={styles["slider-container"]}>
          <ComparisonWithSlider
            beforeImageURL="/images/timberlands-alltrails.large.png"
            afterImageURL="/images/timberlands-kiosk.large.jpeg"
          />
        </div>
      </div>
      <div className={styles["content-section"]}>
        <h2>More to Come.</h2>
        <p>New features delivered every week.</p>
        <h3>Up Next:</h3>
        <p>🧭 Keep Adding More Pins to Increase Accuracy</p>
        <p>📍 Zoom Map to Your Current Location </p>
      </div>
      <Button
        type="gradient-primary"
        size="medium"
        onClick={() => router.push("navigate")}
      >
        Start Navigating
      </Button>
    </>
  );
}

function InfoForTrailManagers() {
  return (
    <>
      <div className={styles["content-section"]}>
        <h1 className={"gradient-text"}>Guide Everyone.</h1>
        <span className={styles.subtitle}>
          Provide GPS-enabled maps to everyone that visits your trails.
        </span>
      </div>
      <Button
        type="gradient-primary"
        size="medium"
        onClick={() => {
          window.location.href = "mailto:setup@adambechtold.xyz";
        }}
      >
        Contact for Setup
      </Button>
      <div className={styles["content-section"]}>
        <h2>
          BYOM.
          <br />
          (Bring Your Own Maps)
        </h2>
        <p>
          You already have great maps with local details. Seamlessly layer hiker
          location on top.
        </p>
      </div>
      <div className={styles["content-section"]}>
        <h2>Scan and Go.</h2>
        <p>Deliver connected maps at the trailhead.</p>
        <p>
          Visitors scan a QR code and hike. No app download or configuration
          required.
        </p>
        <p style={{ marginTop: "1rem" }}>
          Try out these <a href={"/demo/preset-maps"}>demo maps</a>{" "}
          pre-configured for Guilford, CT.
        </p>
      </div>
      <div className={styles["content-section"]}>
        <h2>Easy Setup.</h2>
        <p>Send us your maps, and we'll set them up.</p>
        <p>You just place the QR code on site.</p>
      </div>
      <Button
        type="gradient-secondary"
        size="medium"
        onClick={() => {
          window.location.href = "mailto:feedback@adambechtold.xyz";
        }}
      >
        Request Access
      </Button>
    </>
  );
}
