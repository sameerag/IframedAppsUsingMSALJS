// configure urlNavigate and FrameName
// let urlNavigate = "http://localhost:8002/auth.html";
let urlNavigate = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=token&scope=Mail.Read%20openid%20profile&client_id=6216ed4a-b6c4-4c4a-8feb-7b5aede89650&redirect_uri=http%3A%2F%2Flocalhost%3A8002%2Fauth.html&state=a4a840f2-4da6-488e-b7af-0931de744407&nonce=9e6acbd7-491b-410f-81c2-07b87213519a&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.0.1&login_hint=sam%40samtest.onmicrosoft.com&login_req=4233f193-c792-40be-bfca-104243b13150&domain_req=f3c9e581-96ad-4f1b-9527-0e71185cf5e7&domain_hint=organizations&client-request-id=c126b538-e274-4d2e-9a53-ea01c2dede6f&response_mode=fragment";

let loginInProgress = false;
let acquireTokenInProgress = false;

// call loginPopup
loginPopup(urlNavigate);

function loginPopup(urlNavigate) {
    // Generate a popup window
    const popUpWindow = openWindow("about:blank", "_blank", 1);
    if (!popUpWindow) {
        return null;
    }

    // prompt user for interaction
    navigateWindow(urlNavigate, popUpWindow);
}

function openWindow(urlNavigate, title, interval) {
    // Generate a popup window
    let popupWindow;
    try {
        popupWindow = openPopup(urlNavigate, title, 483, 600);
    } catch (e) {
        console.log("error in opening a Popup Window")
        return null;
    }

    const pollTimer = window.setInterval(() => {
    // If popup closed or login in progress, cancel login
        if (popupWindow && popupWindow.closed && (loginInProgress || acquireTokenInProgress)) {
            console.log("login is already in progress");
            window.clearInterval(pollTimer);
            loginInProgress = false;
            acquireTokenInProgress = false;
            return null;
        }

        try {
            const popUpWindowLocation = popupWindow.location;

            // If the popup hash changes, close the popup window
            if (popUpWindowLocation.href.indexOf("http://localhost:8002/auth.html/") !== -1) {
                window.clearInterval(pollTimer);
                loginInProgress = false;
                acquireTokenInProgress = false;
                console.log("Closing popup window");
            }
        } catch (e) {
            // Cross Domain url check error.
            // Will be thrown until AAD redirects the user back to the app"s root page with the token.
            // No need to log or throw this error as it will create unnecessary traffic.
        }
    },
    interval);

    return popupWindow;
}

// Open a POPUP 
function openPopup(urlNavigate, title, popUpWidth, popUpHeight) {
    try {
        // adding winLeft and winTop to account for dual monitor; using screenLeft and screenTop for IE8 and earlier
        const winLeft = window.screenLeft ? window.screenLeft : window.screenX;
        const winTop = window.screenTop ? window.screenTop : window.screenY;
        // window.innerWidth displays browser window"s height and width excluding toolbars; using document.documentElement.clientWidth for IE8 and earlier
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const left = ((width / 2) - (popUpWidth / 2)) + winLeft;
        const top = ((height / 2) - (popUpHeight / 2)) + winTop;

        // open the window
        const popupWindow = window.open(urlNavigate, title, "width=" + popUpWidth + ", height=" + popUpHeight + ", top=" + top + ", left=" + left);
        if (!popupWindow) {
            console.log("error opening popup")
        }
        if (popupWindow.focus) {
            popupWindow.focus();
        }
        return popupWindow;
    } catch (e) {
        console.log("error opening popup " + e.message);
    }
}

function navigateWindow(urlNavigate, popupWindow) {
    // Navigate if valid URL
    if (urlNavigate && !isEmpty(urlNavigate)) {
        const navigateWindow = popupWindow ? popupWindow : window;
        const logMessage = popupWindow ? "Navigated Popup window to:" + urlNavigate : "Navigate to:" + urlNavigate;
        console.log(logMessage);
        navigateWindow.location.replace(urlNavigate);
    }
    else {
        console.log("Navigate url is empty");
        throw error("Navigate url is empty");
    }
}

function isEmpty(str) {
    return (typeof str === "undefined" || !str || 0 === str.length);
}

// Silent Token acquisition
function acquireTokenSilent(urlNavigate) {
    let frameName = "msalHiddenIframe";

    // load the hidden iframe
    loadFrame(urlNavigate, frameName);
}


// Loads iframe with authorization endpoint URL
function loadFrame(urlNavigate, frameName) {
    // This trick overcomes iframe navigation in IE
    // IE does not load the page consistently in iframe
    console.log("LoadFrame: " + frameName);
    const frameCheck = frameName;

    return new Promise((resolve) => {
        setTimeout(() => {
            const frameHandle = addHiddenIFrame(frameCheck);
            if (frameHandle.src === "" || frameHandle.src === "about:blank") {
                frameHandle.src = urlNavigate;
                console.log("Frame Name : " + frameName + " Navigated to: " + urlNavigate);
            }

            resolve(frameHandle);
        },
            500);
    });
}

// Adds the hidden iframe for silent token renewal.
function addHiddenIFrame(iframeId) {
    if (typeof iframeId === "undefined") {
        return null;
    }

    console.log("Add msal frame to document:" + iframeId);
    let msalFrame = document.getElementById(iframeId);
    if (!msalFrame) {
        if (document.createElement &&
            document.documentElement &&
            (window.navigator.userAgent.indexOf("MSIE 5.0") === -1)) {
            const ifr = document.createElement("iframe");
            ifr.setAttribute("id", iframeId);
            ifr.setAttribute("sandbox", "allow-same-origin");
            // ifr.sandbox.add("allow-scripts");
            ifr.style.visibility = "hidden";
            ifr.style.position = "absolute";
            ifr.style.width = ifr.style.height = "0";
            ifr.style.border = "0";
            msalFrame = (document.getElementsByTagName("body")[0].appendChild(ifr));
        } else if (document.body && document.body.insertAdjacentHTML) {
            document.body.insertAdjacentHTML("beforeend", "<iframe name='" + iframeId + "' id='" + iframeId + "' style='display:none'></iframe>");
        }

        if (window.frames && window.frames[iframeId]) {
            msalFrame = window.frames[iframeId];
        }
    }

    return msalFrame;
}
