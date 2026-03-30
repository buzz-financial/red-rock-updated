var objectFitVideos = (function (videos) {
    'use strict';
  
    function parseFontFamilyStyle(el) {
      var style = getComputedStyle(el).fontFamily;
      var match = null;
      var styles = {};
      var regex = /(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;
  
      while ((match = regex.exec(style)) !== null) {
        styles[match[1]] = match[2];
      }
  
      if (styles["object-position"]) {
        styles = expandObjectPosition(styles);
      }
  
      return styles;
    }
  
    function expandObjectPosition(styles) {
      if (styles["object-position"].includes("left")) {
        styles["object-position-x"] = "left";
      } else if (styles["object-position"].includes("right")) {
        styles["object-position-x"] = "right";
      } else {
        styles["object-position-x"] = "center";
      }
  
      if (styles["object-position"].includes("top")) {
        styles["object-position-y"] = "top";
      } else if (styles["object-position"].includes("bottom")) {
        styles["object-position-y"] = "bottom";
      } else {
        styles["object-position-y"] = "center";
      }
  
      return styles;
    }
  
    function applyObjectFit(video, styles) {
      if (styles["object-fit"] === "fill") return;
  
      var videoStyle = video.style;
      var computedStyle = window.getComputedStyle(video);
      var wrapper = document.createElement("object-fit");
  
      video.parentNode.replaceChild(wrapper, video);
      wrapper.appendChild(video);
  
      // Inherit styles from video to wrapper
      var inheritedStyles = {
        height: "100%",
        width: "100%",
        boxSizing: "content-box",
        display: "inline-block",
        overflow: "hidden"
      };
  
      "backgroundColor backgroundImage borderColor borderStyle borderWidth bottom fontSize lineHeight left opacity margin position right top visibility"
        .split(" ")
        .forEach(function (prop) {
          inheritedStyles[prop] = computedStyle[prop];
        });
  
      Object.assign(wrapper.style, inheritedStyles);
  
      videoStyle.border = videoStyle.margin = videoStyle.padding = 0;
      videoStyle.display = "block";
      videoStyle.opacity = 1;
  
      function resize() {
        var videoRatio = video.videoWidth / video.videoHeight;
        var containerWidth = wrapper.clientWidth;
        var containerHeight = wrapper.clientHeight;
        var containerRatio = containerWidth / containerHeight;
        var width, height;
  
        videoStyle.marginLeft = videoStyle.marginTop = 0;
  
        var fit = styles["object-fit"];
        if ((videoRatio < containerRatio && fit === "contain") || (videoRatio >= containerRatio && fit === "cover")) {
          width = containerHeight * videoRatio;
          height = containerHeight;
          videoStyle.width = Math.round(width) + "px";
          videoStyle.height = containerHeight + "px";
  
          if (styles["object-position-x"] === "left") {
            videoStyle.marginLeft = 0;
          } else if (styles["object-position-x"] === "right") {
            videoStyle.marginLeft = Math.round(containerWidth - width) + "px";
          } else {
            videoStyle.marginLeft = Math.round((containerWidth - width) / 2) + "px";
          }
        } else {
          width = containerWidth;
          height = containerWidth / videoRatio;
          videoStyle.width = width + "px";
          videoStyle.height = Math.round(height) + "px";
  
          if (styles["object-position-y"] === "top") {
            videoStyle.marginTop = 0;
          } else if (styles["object-position-y"] === "bottom") {
            videoStyle.marginTop = Math.round(containerHeight - height) + "px";
          } else {
            videoStyle.marginTop = Math.round((containerHeight - height) / 2) + "px";
          }
        }
  
        if (video.autoplay) {
          video.play();
        }
      }
  
      video.addEventListener("loadedmetadata", resize);
      window.addEventListener("optimizedResize", resize);
  
      if (video.readyState >= 1) {
        video.removeEventListener("loadedmetadata", resize);
        resize();
      }
    }
  
    function setup(videos) {
      if (!videos) {
        videos = document.querySelectorAll("video");
      } else if (!("length" in videos)) {
        videos = [videos];
      }
  
      Array.prototype.forEach.call(videos, function (video) {
        var styles = parseFontFamilyStyle(video);
        if (styles["object-fit"] || styles["object-position"]) {
          styles["object-fit"] = styles["object-fit"] || "fill";
          applyObjectFit(video, styles);
        }
      });
    }
  
    function optimizedResizeListener(eventType, eventName, context) {
      context = context || window;
      var running = false;
      var event;
  
      try {
        event = new CustomEvent(eventName);
      } catch (e) {
        event = document.createEvent("Event");
        event.initEvent(eventName, true, true);
      }
  
      function handler() {
        if (!running) {
          running = true;
          requestAnimationFrame(function () {
            context.dispatchEvent(event);
            running = false;
          });
        }
      }
  
      context.addEventListener(eventType, handler);
    }
  
    var isEdge = navigator.userAgent.indexOf("Edge/") >= 0;
    var testImage = new Image();
    var supportsObjectFit = "object-fit" in testImage.style && !isEdge;
    var supportsObjectPosition = "object-position" in testImage.style && !isEdge;
  
    if (!supportsObjectFit || !supportsObjectPosition) {
      setup(videos);
      optimizedResizeListener("resize", "optimizedResize");
    }
  
    return setup;
  })();
  