Demo application to support MSAL JS in Iframed apps

App Models:
Main Application in a fill window - App A
Same Domain, iframed application - App AB
Cross Domain, iframed application - App AC
Cross Domain, nested iframed application - App ACE
Cross Domain, iframed application - App AD

Scenarios:
Token acquisitions with loginPopup(), acquireTokenPopup(), and acquireTokenSilent()
Token acquisitions with loginRedirect(), and acquireTokenRedirect