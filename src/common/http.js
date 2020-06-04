import Axios from "axios";
import qs from "qs";

// x-www-form
const postForm = (url, data) => {
    let option = {
        method:'post',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data:qs.stringify(data)
    }
    option.headers = Object.assign(option.headers,{"X-Auth-Token":sessionStorage.getItem("token")})
    return Axios(option);
}

export default {
    postForm: postForm
};