let timetableEl = null;

const createTimetableEl = () => {
    timetableEl = document.createElement('div');
    timetableEl.id = 'timetable-window';
    timetableEl.className = 'window';
    timetableEl.draggable = true;
    timetableEl.innerHTML = getInnerHtmlOfTimetableEl();
};

const getInnerHtmlOfTimetableEl = () => {
    return `
    
    `;
};

export { createTimetableEl };
