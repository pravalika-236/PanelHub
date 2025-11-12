export const formateTableDate = (timeRange) => {
    const [startHour] = timeRange.split('-').map(Number);

    const period = startHour >= 12 ? 'PM' : 'AM';
    const hour12 = startHour % 12 || 12;

    return `${hour12} ${period}`;
}

export const formateDateToMMMDD = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const options = { day: '2-digit', month: 'short' };
    const formatted = date.toLocaleDateString('en-GB', options);

    return formatted;
}

export const formateDateToWWW = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const options = { month: 'short', day: '2-digit', weekday: 'short' };
    const formatted = date.toLocaleDateString('en-US', options);

    const [weekday] = formatted.replace(',', '').split(' ');
    return weekday;
}

export const getSlotColor = (date, time, calendar) => {
    const slot = calendar[date]?.[time];
    if (!slot) return '#f8f9fa';

    const categories = Object.values(slot).filter(Boolean);
    if (categories.length === 0) return '#f8f9fa';
    if (categories.length === 1) return '#d4edda';
    if (categories.length === 2) return '#fff3cd';
    return '#d1ecf1';
};

export const getWeekDates = (calendar) => {
    return Object.keys(calendar);
};

export const timeSlots = [
    '08-09', '09-10', '10-11', '11-12', '12-13',
    '13-14', '14-15', '15-16', '16-17', '17-18',
    '18-19', '19-20'
];

export const getSlotText = (date, time, calendar) => {
    const slot = calendar[date]?.[time];
    if (!slot) return '';

    return Object.keys(slot)
        .filter(key => slot[key] && key != "bookStatus")
        .join('/');
};

export const getSlotBookStatus = (date, time, calendar) => {
    const slot = calendar[date]?.[time];
    if (!slot) return false;

    return slot["bookStatus"]
};

export const getDateToday = () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    return formattedToday;
}

export const formatDateToDDMMYYYY = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}

export const getFacultyNameMapping = (faculty, facultyList) => {
    const data = facultyList.find(item => item._id === faculty)
    return data?.name;
}

export const getFacultyEmailMapping = (faculty, facultyList) => {
    const data = facultyList.find(item => item._id === faculty)
    return data?.email;
}