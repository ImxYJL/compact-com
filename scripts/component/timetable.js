let timetableEl = null;

const createTimetableEl = () => {
    timetableEl = document.createElement('div');
    timetableEl.id = 'timetable-window';
    timetableEl.className = 'window';
    timetableEl.draggable = true;
    timetableEl.innerHTML = getInnerHtmlOfTimetableEl();

    return timetableEl;
};

const getInnerHtmlOfTimetableEl = () => {
    return `
        <div class="title-bar">
            <div class="title-bar-text">Timetable</div>
            <div class="title-bar-controls">
                <button id ="close-btn" aria-label="Close"></button>
            </div>
        </div>
        <div id="timetable-body" class="window-body">
            <div id="timetable-content-body" class="window" role="tabpanel">
                    <div id="timetable-container">

                        <div id = 'table'></div>
                        <div class="wrapper">
                        <table>
                            <caption>Timetable</caption>
                            <tr>
                                <th>Time</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>

                            </tr>
                            <tr>
                                <td>9:00</td>
                                <td></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>10:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>11:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>12:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>13:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>14:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>15:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>16:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                            <tr>
                                <td>17:00</td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                                <td contenteditable=""></td>
                            </tr>
                        </table>
                    </div>
                    </div>
                    <div id="timetable-side-container">
                        <div>hello</div>
                    </div>
            </div>
        </div>
    `;
};

export { createTimetableEl };
