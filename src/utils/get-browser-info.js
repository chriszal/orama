export function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
  
    // Detect browser
    if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Apple Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
      browserName = "Microsoft Internet Explorer";
    }
  
    return browserName;
  }
  