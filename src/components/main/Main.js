import React, { useEffect, useState, useRef } from 'react'
import AppMenuBar from '../header/Menubar'
import { Card } from 'primereact/card'
import { callPublicApis } from '../../utilities/http'
import SlotTable from './SlotDataTable'
import beepsound from '../../resources/beep.mp3'
import { Toast } from 'primereact/toast'

export default function Main() {
    const audioRef = useRef(null)
    const toastRef = useRef(null)
    const [states, setStates] = useState([])
    const [dataSet, setDataSet] = useState({
        errorMessage: 'Start searching to view slots availability',
        timeStamp: '',
        slotList: []
    })

    const setData = (dataset) => {
        if (dataset.slotList.length) {
            audioRef.current.play()
        }
        toastRef.current.show({severity: 'info', summary: 'Checked cowin portal at: ', detail: dataset.timeStamp, life: 3000});
        setDataSet(dataset)
    }

    useEffect( () => {
        (async () => {
            const response = await callPublicApis({
                url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
            })
            const listOfStates = await response.json();
            setStates(listOfStates.states);
        })()
    }, [])

    return (
        <React.Fragment>
            <div className="p-grid full-height">
                <div className="p-col-12 full-height">
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
            <audio ref={audioRef} >
                <source src={beepsound}/>
            </audio>
        </React.Fragment>
    )
}
