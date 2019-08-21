const urlHash = window.location.hash;
const hasHash = urlContainsHash(urlHash);

// if the URL consists the hash
if (hasHash) {
    window.parent.postMessage(urlHash, "http://localhost:8002");
}

// Does the URL contain the hash
function urlContainsHash(urlString) {
    const parameters = deserializeHash(urlString);
    return (
        parameters.hasOwnProperty("error_description") ||
    parameters.hasOwnProperty("error") ||
    parameters.hasOwnProperty("access_token") ||
    parameters.hasOwnProperty("id_token")
    );
}

// deserialize the  hash
function deserializeHash(urlFragment) {
    const hash = getHashFromUrl(urlFragment);
    return deserialize(hash);
}

// get the hash from the URL
function getHashFromUrl(urlStringOrFragment) {
    const hashIndex1 = urlStringOrFragment.indexOf("#");
    const hashIndex2 = urlStringOrFragment.indexOf("#/");
    if (hashIndex2 > -1) {
        return urlStringOrFragment.substring(hashIndex2 + 2);
    } else if (hashIndex1 > -1) {
        return urlStringOrFragment.substring(hashIndex1 + 1);
    }
    return urlStringOrFragment;
}

// general deserialize util
function deserialize(query) {
    let match // Regex for replacing addition symbol with a space
    const pl = /\+/g;
    const search = /([^&=]+)=([^&]*)/g;
    const decode = (s) => decodeURIComponent(s.replace(pl, " "));
    const obj = {};
    match = search.exec(query);
    while (match) {
        obj[decode(match[1])] = decode(match[2]);
        match = search.exec(query);
    }
    return obj;
}


