const validation = (value, rules) => {
    let valid = true;
    for (let rule in rules) {
        switch (rule) {
            case "isRequired":
                valid = valid && validateRequired(value);
                break;
            case "isEmail":
                valid = valid && validateEmail(value);
                break;
            case "minLength":
                valid = valid && validateLength(value,rules[rule]);
                break;
            default:
                valid = true;
                break;
        }
    }
    return valid;
}

const validateRequired = value => {
    if (value !== '') {
        return true;
    }
    return false
}
const validateLength = (value, ruleValue) => {
    if (value.length > ruleValue) {
        return true;
    }
    return false
}
const validateEmail = email => {
    var expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return expression.test(String(email).toLocaleLowerCase());
}

export default validation;