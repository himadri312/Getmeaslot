import React, { useRef, useState } from 'react'
import { SelectButton } from 'primereact/selectbutton'
import { Divider } from 'primereact/divider'
import { Card }  from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Messages } from 'primereact/messages'
import { Calendar } from 'primereact/calendar'
import { locateSlots, stopLocatingSlots } from "../../utilities/slotLocator"
import { callPublicApis } from "../../utilities/http"
import { formatDate } from '../../utilities/dateConverter'
import ReactGA from 'react-ga'

export default function SearchDialog({ statesList, setDataSet, displaySearchDialog, setDisplaySearchDialog }) {
    let searchView;
    const messages = useRef(null);

    const [selectedSearch, setSelectedSearch] = useState('searchByPin');
    const [pin, setPin] = useState();
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [showFutureDates, setShowFutureDates] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [recurringSearchTriggered, setRecurringSearchTriggered] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [districts, setDistricts] = useState([]);
    const [disabledDistrictField, setDisabledDistrictField] = useState(true);

    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    const searchOptions = [
        {label: 'By Pin', value: 'searchByPin'},
        {label: 'By District', value: 'searchByDistrict'}
    ];

    const  searchSlots = () => {
        if (selectedSearch === 'searchByPin') {
            searchSlotsByPin()
        } else if (selectedSearch === 'searchByDistrict') {
            searchSlotsByDistrict()
        }
    };

    const stopSearch = () => {
        stopLocatingSlots();
        setRecurringSearchTriggered(false);
    };

    const searchSlotsByPin = () => {
        const regex = /^[1-9][0-9]{5}$/;
        if (!regex.test(pin)) {
            if (messages && messages.current) {
                messages.current.show({sticky: true, severity: 'error', summary: 'Invalid pincode'});
            }
            return;
        }
        setDisplaySearchDialog(false);
        if (autoRefresh) {
            setRecurringSearchTriggered(true);
        }
        locateSlots({selectedSearch, pin, selectedDate, autoRefresh, showFutureDates, setDataSet})
        ReactGA.event({
            category: 'SEARCH DIALOG',
            action: 'Search by Pin',
            label: 'SEARCH_BUTTON_PRESS '
        })
    };

    const searchSlotsByDistrict = () => {
        if (!selectedDistrict) {
            if (messages && messages.current) {
                messages.current.show({sticky: true, severity: 'error', summary: 'Please select district'});
            }
            return;
        }
        setDisplaySearchDialog(false);
        if (autoRefresh) {
            setRecurringSearchTriggered(true);
        }
        locateSlots({selectedSearch, selectedDistrict, selectedDate, autoRefresh, showFutureDates, setDataSet})
        ReactGA.event({
            category: 'SEARCH_DIALOG',
            action: 'Search by District',
            label: 'SEARCH_BUTTON_PRESS '
        })
    };

    const handleStateSelection = (selectedStateId) => {
        if (selectedStateId) {
            setDisabledDistrictField(false)
        } else {
            setDisabledDistrictField(true)
        }
        setSelectedState(selectedStateId);
        callPublicApis({
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/districts' + `/${selectedStateId}`
        }).then(response => response.json())
            .then(listOfDistricts => {
                if (messages && messages.current) {
                    messages.current.clear();
                }
                setDistricts(listOfDistricts.districts);
            })
            .catch(error => {
                if (messages && messages.current) {
                    messages.current.show({sticky: true, severity: 'error', summary: 'Unable to fetch districts. Try again'});
                    setDistricts([]);
                }
            })
    };

    const setSelectedSearchValue = (selectedSearchValue) => {
        if (selectedSearchValue === null) {
            setSelectedSearch(selectedSearch)
        } else {
            setSelectedSearch(selectedSearchValue);
            if (messages && messages.current) {
                messages.current.clear();
            }
        }
    };

    if (selectedSearch === 'searchByPin') {
        searchView = (
            <React.Fragment>
                <InputNumber
                    value={pin}
                    onChange={(event) => setPin(event.value)}
                    className="p-col-12"
                    placeholder="Enter Pincode"
                    useGrouping={false}
                    disabled={recurringSearchTriggered}
                />
                <div className="p-col-12"/>
            </React.Fragment>
        )
    } else if (selectedSearch === 'searchByDistrict') {
        searchView = (
            <React.Fragment>
                <Dropdown
                    optionLabel="state_name"
                    optionValue="state_id"
                    value={selectedState}
                    options={statesList}
                    onChange={(e) => handleStateSelection(e.value)}
                    placeholder="Select state"
                    className="p-col-12"
                    disabled={recurringSearchTriggered}
                />
                <Dropdown
                    optionLabel="district_name"
                    optionValue="district_id"
                    value={selectedDistrict}
                    options={districts}
                    onChange={(e) => setSelectedDistrict(e.value)}
                    className="p-col-12"
                    placeholder="Select district"
                    disabled={disabledDistrictField || recurringSearchTriggered}
                />
            </React.Fragment>
        )
    } else {
        searchView = <div>Something went wrong. Please reload</div>
    }

    return (
        <React.Fragment>
            <Dialog header="Search Slots"
                    visible={displaySearchDialog}
                    onHide={() => setDisplaySearchDialog(false)}
                    resizable={false}
                    breakpoints={{'1024px': '75vw', '640px': '100vw'}}
                    style={{width: '30vw'}}>
                <div className="p-grid">
                    <div className="p-col p-d-flex p-jc-center">
                        <SelectButton
                            value={selectedSearch}
                            options={searchOptions}
                            onChange={(event) => setSelectedSearchValue(event.value)}
                        />
                    </div>
                </div>
                <Divider className="p-mt-1"/>
                <div className="p-grid">
                    {searchView}
                    <div className="p-col-12">
                        <Calendar id="basic"
                                  dateFormat="dd-mm-yy"
                                  value={selectedDate}
                                  minDate={new Date()}
                                  maxDate={maxDate}
                                  onChange={(e) => setSelectedDate(e.value)}
                                  className="p-col-12 p-p-0"
                                  disabled={recurringSearchTriggered}
                        />
                    </div>
                    <div className="p-col-12">
                        <Checkbox
                            checked={showFutureDates}
                            onChange={(event) => setShowFutureDates(event.checked)}
                            inputId="futureDates"
                            disabled={recurringSearchTriggered}
                        />
                        <label htmlFor="futureDates" className="p-checkbox-label  p-ml-2">Future dates (Slots availability till {formatDate(maxDate)})</label>
                    </div>
                    <div className="p-col-12">
                        <Checkbox
                            checked={autoRefresh}
                            onChange={(event) => setAutoRefresh(event.checked)}
                            inputId="autoRefresh"
                            disabled={recurringSearchTriggered}
                        />
                        <label htmlFor="autoRefresh" className="p-checkbox-label  p-ml-2">Auto refresh (Trigger auto search at 5s interval)</label>
                    </div>
                    <div className="p-col-12">
                        <Button
                            label="Find slot"
                            className="p-button p-col-12"
                            onClick={searchSlots}
                            disabled={recurringSearchTriggered}
                        />
                    </div>
                    {recurringSearchTriggered && <div className="p-col-12">
                        <Button
                            label="Stop search"
                            className="p-button p-col-12"
                            onClick={stopSearch}
                        />
                    </div>}
                    <Messages ref={messages} className="p-col-12 searchFieldErrorMessage"/>
                </div>
                <Divider className="p-mt-2"/>
                <Card className="disclaimer">
                    <p>Do not close the browser if <b>'Auto refresh'</b> is selected. Once any slot is available the details will be displayed and you will also get a notification sound.</p>
                    <p>Disclaimer : Due to high demand, slot availability on CoWin changes rapidly. Please book the slots on CoWin as soon as they are available.</p>
                </Card>
            </Dialog>
        </React.Fragment>
    )
}
