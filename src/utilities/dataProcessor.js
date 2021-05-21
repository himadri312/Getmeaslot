export const processSessions = (dataSet, requestTimeStamp) => {
    const processedDataSet = {
        errorMessage: '',
        timeStamp: requestTimeStamp,
        slotList: []
    };
    console.log(dataSet);
    dataSet.forEach((data) => {
        const processedData = {
            name: data.name,
            address: data.address,
            district_name: data.district_name,
            pincode: data.pincode,
            fee_type: data.fee_type,
            fee: data.fee,
            date: data.date,
            age: data.min_age_limit === 18 ? 'Age 18+' : 'Age 45+',
            vaccine: data.vaccine
        };

        if (data.available_capacity_dose1) {
            processedDataSet.slotList.push({...processedData, dose: 'Dose1', doseCapacity: data.available_capacity_dose1})
        }
        if (data.available_capacity_dose2) {
            processedDataSet.slotList.push({...processedData, dose: 'Dose2', doseCapacity: data.available_capacity_dose2})
        }
    });
    if (!processedDataSet.slotList.length) {
        processedDataSet.errorMessage = 'No slots available. Please refine search criteria'
    }
    return processedDataSet;
};

export const processError = (error, requestTimeStamp) => {
     const processedDataSet = {
         errorMessage: `Not able to connect Cowin server at ${requestTimeStamp}. If auto refresh is not checked please search again`,
         timeStamp: requestTimeStamp,
         slotList: []
     };
     return processedDataSet
};

export const processCenters = (dataSet, requestTimeStamp) => {
    console.log(dataSet);
    const processedDataSet = {
        errorMessage: '',
        timeStamp: requestTimeStamp,
        slotList: []
    };
    dataSet.forEach(data => {

        const processedData = {
            name: data.name,
            address: data.address,
            district_name: data.district_name,
            pincode: data.pincode,
            fee_type: data.fee_type,
        };
        data.sessions.forEach(session => {
            const sessionData = {
                date: session.date,
                age: data.min_age_limit === 18 ? 'Age 18+' : 'Age 45+',
                fee: data.fee_type === 'Paid' ? getFee(data, session.vaccine) : '',
                vaccine: session.vaccine
            };
            if (session.available_capacity_dose1) {
                processedDataSet.slotList.push({...processedData, ...sessionData, dose: 'Dose1', doseCapacity: session.available_capacity_dose1})
            }
            if (session.available_capacity_dose2) {
                processedDataSet.slotList.push({...processedData, ...sessionData, dose: 'Dose2', doseCapacity: session.available_capacity_dose2})
            }

        })
    });
    if (!processedDataSet.slotList.length) {
        processedDataSet.errorMessage = 'No slots available. Please refine search criteria'
    }
    return processedDataSet;
};

const getFee = (data, vaccineName) => {
    let fee = "";
    if (data.vaccine_fees && data.vaccine_fees.length) {
        data.vaccine_fees.forEach(vaccineFeeDetail => {
            if (vaccineFeeDetail.vaccine === vaccineName) {
                fee = vaccineFeeDetail.fee
            }
        });
    }
    return fee;
};