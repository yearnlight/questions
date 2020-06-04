const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n

}

const datetime = timestamp => {
    var date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const date = timestamp => {
    var date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-');
}

//按照属性分组
const groupByField = (list, field) => {
    let sortedList = list.sort((a, b) => {
        return a[field] - b[field];
    });

    let hash = {};
    let res = [];
    let n = -1;
    sortedList.forEach(item => {
        if (!hash[item[field]]) {
            n++;
            hash[item[field]] = true;
            res[n] = [item];
        }
        else {
            let index = Object.keys(hash).indexOf(item[field]);
            res[index].push(item);
        }

    });
    return res;
}

export default {
    datetime: datetime,
    date:date,
    groupByField: groupByField
}