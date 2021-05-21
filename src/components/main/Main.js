import React, { useEffect, useState, useRef } from 'react'
import AppMenuBar from '../header/Menubar'
import { Card } from 'primereact/card'
import { callPublicApis } from '../../utilities/http'
import SlotTable from './SlotDataTable'
import { Toast } from 'primereact/toast'

export default function Main() {
    const toastRef = useRef(null);
    const [states, setStates] = useState([]);
    const [dataSet, setDataSet] = useState({
        errorMessage: 'Start searching to view slots availability',
        timeStamp: '',
        slotList: []
    });

    const setData = (dataset) => {
        if (toastRef && toastRef.current) {
            toastRef.current.show({severity: 'info', summary: 'Checked cowin portal at: ', detail: dataset.timeStamp, life: 3000});
        }
        setDataSet(dataset)
    };

    useEffect( () => {
        callPublicApis({
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }).then(response => response.json())
            .then(listOfStates => setStates(listOfStates.states))
            .catch(error => {
                if (toastRef && toastRef.current) {
                    toastRef.current.show({
                        severity: 'error',
                        summary: 'Unable to fetch states from Cowin portal',
                        detail: 'Please reload or continue search using pincode.',
                        sticky: true
                    });
                }
            });
    }, []);

    return (
        <React.Fragment>
            <div className="p-grid full-height">
                <div className="p-col-12">
                    <div className="p-grid">
                        <Toast ref={toastRef} position="bottom-right"/>
                        <div className="p-col-12 p-mb-0">
                            <AppMenuBar states={states} setDataSet={setData}/>
                        </div>
                        <div className="p-col-12 bottom-panel">
                            <Card className="p-col-12">
                                <SlotTable dataSet={dataSet}></SlotTable>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
