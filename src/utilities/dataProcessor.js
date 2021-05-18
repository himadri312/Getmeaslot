export const processSessions = (dataSet, requestTimeStamp) => {
    const processedDataSet = {
        errorMessage: '',
        timeStamp: requestTimeStamp,
        slotList: []
    };
    if (!dataSet.length) {
        processedDataSet.errorMessage = 'No slots available. Please refine search criteria'
    }
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
        }

        if (data.available_capacity_dose1) {
            processedDataSet.slotList.push({...processedData, dose: 'Dose1', doseCapacity: data.available_capacity_dose1})
        }
        if (data.available_capacity_dose2) {
            processedDataSet.slotList.push({...processedData, dose: 'Dose2', doseCapacity: data.available_capacity_dose2})
        }
    })
    return processedDataSet;
}

export const processError = (error, requestTimeStamp) => {
     const processedDataSet = {
         errorMessage: `Not able to connect Cowin server at ${requestTimeStamp}. If auto refresh is not checked please search again`,
         timeStamp: requestTimeStamp,
         slotList: []
     }
     return processedDataSet
}