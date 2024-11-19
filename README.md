# ⛰️ Trailhead 🗺️

Alltrails, Gaia GPS, and Google Maps provide a huge library of GPS-enabled maps you can use _if you prepare ahead of time._ If you forget to download the trail before you leave the house or you choose a new trail, you're out of luck. I take a picture of the trail map at the trailhead and try to keep track of my progress as I walk, but I often lose my place.

Trailhead turns any image into a GPS-enabled map: it provides a pin that shows your current location as you walk.

Just a few setup steps:

1. At the trailhead, select your current position on the map.
2. Walk to the first fork in the trail, and select your current position on the map.
3. That's it! Enjoy the hike!

## [Try it Out Now](https://trailhead.adambechtold.xyz)

## Demo
https://github.com/adambechtold/trailhead/assets/22563063/74184fa5-545e-41a4-a7fa-2f3c59d61b0c

# Offline Use

Trailhead is a Progressive Web App. It's cached on your phone so you can use it offline, including any maps you've saved from previous hikes.

Consider adding it to your homescreen for an app-like experience ([iOS](https://trailhead.adambechtold.xyz/videos/demo-trailhead.large.mp4) / [Android](https://www.androidauthority.com/add-website-android-iphone-home-screen-3181682/)).

# Roadmap

## 1) 🔄 Polish Offline Use
Trailhead works offline, but there are a few rough edges. 

1) ✅ Allow Users to Add More than 2 Pins
2) ✅ Create Prompts to Guide First-time Users

## 2) ✅ Integrate into Online Trail Maps
Place a Trailhead QR code on trail maps so hikers can rapidly access pre-configured maps. 

## 3) Integrate into Offline Trail Maps
Create printable trail maps that already contain configuration information on them. Just add the picture and Trailhead reads the configuration off the map.

# Develop

Want to host Trailhead yourself?

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
