const prefix = "";

const question = {
    "list": `${prefix}/question-bank/comQuestion/questionList`,
    "add": `${prefix}/question-bank/comQuestion/addSubject`,
    "labelTree": `${prefix}/question-bank/comQuestion/languageLabelTree`,
    "del": `${prefix}/question-bank/comQuestion/delSubject`,
    "info": `${prefix}/question-bank/comQuestion/findSubject`,
    "update": `${prefix}/question-bank/comQuestion/updateSubject`,
    "configLabel": `${prefix}/question-bank/comQuestion/addOrUpdateLabel`,
    "delLabel": `${prefix}/question-bank/comQuestion/delLabel`,
    "configLan": `${prefix}/question-bank/comQuestion/addOrUpdateLanguageType`,
    "delLan": `${prefix}/question-bank/comQuestion/delLanguageType`,
    "lanTypes": `${prefix}/question-bank/comQuestion/findLanguageType`,
    "publishs": `${prefix}/question-bank/comQuestion/findSubjectByUserId`
}

const integral = {
    "getIntegral": `${prefix}/question-bank/comQuestion/findByUserId`
}

const template = {
    "list": `${prefix}/question-bank/comQuestion/findSubjectModelList`,
    "expiredList": `${prefix}/question-bank/comQuestion/effectiveTimeSubjectModel`,
    "add": `${prefix}/question-bank/comQuestion/addSubjectModel`,
    "update": `${prefix}/question-bank/comQuestion/updateSubjectModel`,
    "del": `${prefix}/question-bank/comQuestion/delSubjectModel`,
    "types": `${prefix}/question-bank/comQuestion/findModelType`,
    "info": `${prefix}/question-bank/comQuestion/findOneSubjectModel`,
}

const auth = {
    "login": `${prefix}/system-manage/session/loginUser`,
    "logout": `${prefix}/system-manage/session/signCommonOut`,
    "userInfo":`${prefix}/system-manage/commonUser/findOneUser`,
    "getCode":`${prefix}/system-manage/commonUser/randCode`,
    "registerAccount":`${prefix}/system-manage/commonUser/addOrUpdateUser`,
}

export default {
    question: question,
    template: template,
    integral:integral,
    auth:auth
}