export const createDefaultFacultyFreeSlots = (facultyId) => {
    const freeSlot = {};
    const today = new Date();

    const timeSlots = [
        "08-09", "09-10", "10-11", "11-12", "12-13",
        "13-14", "14-15", "15-16", "16-17", "17-18",
        "18-19", "19-20"
    ];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

        freeSlot[formattedDate] = {};

        timeSlots.forEach(slot => {
            freeSlot[formattedDate][slot] = {
                UG: false,
                PG: false,
                PHD: false,
                bookStatus: false
            };
        });
    }

    return freeSlot;
}

export const generateDaySlots = (date) => {
  const timeSlots = [
    "08-09", "09-10", "10-11", "11-12", "12-13",
    "13-14", "14-15", "15-16", "16-17", "17-18",
    "18-19", "19-20"
  ];

  const formattedDate = formatDate(date);
  const daySlot = {};
  timeSlots.forEach(slot => {
    daySlot[slot] = { UG: false, PG: false, PHD: false };
  });
  return { [formattedDate]: daySlot };
}

export const formatDate = (date) => {
  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
}
