export function convertDateString(date) {
    let dateString = date.getDate();
    let monthString = date.getMonth() + 1; 
    let yearString = date.getFullYear();
    if(dateString < 10) {
        dateString ='0' + dateString;
    } 
    if(monthString < 10) {
        monthString = '0' + monthString;
    }

    return dateString + '-' + monthString + '-' + yearString
}

export function filterDate(value, filter) {
    if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return value === formatDate(filter);
}

function formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    return day + '-' + month + '-' + date.getFullYear();
}