import { formatDate } from './dateConverter'
import { processSessions, processError } from './dataProcessor'

let interval;

export const locateSlots = (config) => {
    let url = '';
    const date = formatDate(config.selectedDate)
    if (config.selectedSearch === 'searchByPin') {
        if (config.showFutureDates) {
            url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=' + config.pin + '&date=' + date
        } else {
            url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + config.pin + '&date=' + date
        }
    } else if (config.selectedSearch === 'searchByDistrict') {
        if (config.showFutureDates) {
            url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + config.selectedDistrict + '&date=' + date
        } else {
            url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=' + config.selectedDistrict + '&date=' + date
        }
    }

    if (!config.showFutureDates) {
        triggerSlotsFetch({url, setDataSet: config.setDataSet});
        if (config.autoRefresh) {
            interval = setInterval(async () => {
                triggerSlotsFetch({url, setDataSet: config.setDataSet})
            }, 5000)
        }
    } else {
        triggerSlotsFetchForFutureDates({url, setDataSet: config.setDataSet});
        if (config.autoRefresh) {
            interval = setInterval(async () => {
                triggerSlotsFetchForFutureDates({url, setDataSet: config.setDataSet});
            }, 5000)
        }
    }
};

export const stopLocatingSlots = () => {
    if (clearInterval) {
        clearInterval(interval);
    }
};

const triggerSlotsFetchForFutureDates = ({url, setDataSet}) => {
    if (url) {
        fetch(url, {
            headers: {
                Accept: 'application/json'
            }
        }).then(response => response.json())
            .then(slots => setDataSet({slots}))
            .catch(error => setDataSet({error}))
    }
};

const triggerSlotsFetch = ({url, setDataSet}) => {
    if (url) {
        const requestTimeStamp = new Date().toLocaleString();
        fetch(url, {
            headers: {
                Accept: 'application/json'
            }
        }).then(response => response.json())
            .then(slots => setDataSet(processSessions(slots.sessions, requestTimeStamp)))
            .catch(error => setDataSet(processError(error, requestTimeStamp)))
    }
};