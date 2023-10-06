const DAYOFWEEKS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

// Convert numeric data into easy-to-read word
const getDay = (dayNum) => DAYOFWEEKS[dayNum];
const getMonth = (monthNum) => months[monthNum];

const getTime = () => {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    return `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = getMonth(today.getMonth());
    const date = today.getDate();
    const day = getDay(today.getDay()); // day of the week
    return {
        year: year,
        month: month,
        date: date,
        day: day,
    };
};

export { DAYOFWEEKS, getTime, getDate };
