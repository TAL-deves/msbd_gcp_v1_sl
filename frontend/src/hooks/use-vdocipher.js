import { useEffect, useState } from "react";

/**
 *
 * @param {String} VdocipherAPIScriptUrl
 */
export default function () {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  useEffect(() => {
    if (isScriptLoaded) return;
    // console.log("Loading");
    const script = document.createElement("script");
    script.onload = () => setIsScriptLoaded(true);
    script.src = "https://player.vdocipher.com/v2.0/api.js";
    document.body.append(script);
  });

  return {
    loadVideo: function ({ otp, playbackInfo, container, configuration = {} }) {
      const params = new URLSearchParams("");
      const parametersToAdd = { otp, playbackInfo, ...configuration };
      for (const item in parametersToAdd) {
        params.append(item, parametersToAdd[item]);
      }
      const iframe = document.createElement("iframe");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("allow", "autoplay; encrypted-media");
      iframe.setAttribute("frameborder", "0");
      iframe.style = "height: 100%; width: 100%;overflow: auto;";
      iframe.src = "https://player.vdocipher.com/v2.0/?" + params;
      container.append(iframe);
      return iframe;
    },
    isAPIReady: isScriptLoaded
  };
}
