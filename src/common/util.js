const getSession = key => {
    if (key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
    else {
        return {};
    }
}

export default {
    getSession: getSession
}