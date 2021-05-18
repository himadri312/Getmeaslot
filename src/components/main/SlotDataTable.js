import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { filterDate } from '../../utilities/dateConverter'
import * as BodyTemplates from './GridBodyTemplates'
import * as FilterTemplates from './FilterItemTemplates'

export default function SlotDataTable({ dataSet }) {

    const dt = useRef(null);

    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedDose, setSelectedDose] = useState(null);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [selectedAgeLimit, setSelectedAgeLimit] = useState(null);
    const [selectedVaccineType, setSelectedVaccineType] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [enableVolume, setEnableVolume] = useState(true);

    const doses = [
        {name: "Dose1", value: 'Dose1'},
        {name: "Dose2", value: 'Dose2'},
    ];

    const feeType = [
        {name: "Free", value: 'Free'},
        {name: "Paid", value: 'Paid'},
    ];

    const ageLimit = [
        {name: 'Age 18+', value: 'Age 18+'},
        {name: 'Age 45+', value: 'Age 45+'}
    ];

    const vaccineType = [
        {name: 'COVISHIELD', value: 'COVISHIELD'},
        {name: 'COVAXIN', value: 'COVAXIN'}
    ];

    const onDosesChange = (e) => {
        dt.current.filter(e.value, 'dose', 'in');
        setSelectedDose(e.value);
    };

    const onFeeTypeChange = (e) => {
        dt.current.filter(e.value, 'fee_type', 'in');
        setSelectedFeeType(e.value);
    };

    const onAgeLimitChange = (e) => {
        dt.current.filter(e.value, 'age', 'in');
        setSelectedAgeLimit(e.value);
    };

    const onVaccineTypeChange = (e) => {
        dt.current.filter(e.value, 'vaccine', 'in');
        setSelectedVaccineType(e.value);
    };

    const onDateChange = (e) => {
        dt.current.filter(e.value, 'date', 'custom');
        setSelectedDate(e.value);
    };

    const reset = () => {
        setSelectedDose(null);
        setSelectedDate(null);
        setSelectedFeeType(null);
        setSelectedAgeLimit(null);
        setSelectedVaccineType(null);
        setGlobalFilter('');
        dt.current.reset();
    };

    const header = (
        <div className="table-header p-grid p-m-0">
            <Button icon="pi pi-volume-up" className={`p-d-none p-mr-2 p-d-md-${enableVolume ? 'inline':'none'}`} onClick={() => setEnableVolume(false)}/>
            <Button icon="pi pi-volume-off" className={`p-d-none p-mr-2 p-d-md-${!enableVolume ? 'inline':'none'}`} onClick={() => setEnableVolume(true)}/>
            <div className="p-inputgroup p-col-12 p-md-5 p-lg-3 p-p-0">
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
                <Button icon="pi pi-filter-slash" onClick={reset}/>
            </div>
        </div>
    );

    const doseFilter = <MultiSelect value={selectedDose} options={doses} itemTemplate={FilterTemplates.dosesItemTemplate} onChange={onDosesChange} optionLabel="name" optionValue="value" placeholder="All" className="p-column-filter" />;
    const feeTypeFilter = <MultiSelect value={selectedFeeType} options={feeType} itemTemplate={FilterTemplates.feeTypeItemTemplate} onChange={onFeeTypeChange} optionLabel="name" optionValue="value" placeholder="All" className="p-column-filter" />;
    const ageLimitFilter = <MultiSelect value={selectedAgeLimit} options={ageLimit} itemTemplate={FilterTemplates.ageLimitItemTemplate} onChange={onAgeLimitChange} optionLabel="name" optionValue="value" placeholder="All" className="p-column-filter" />;
    const vaccineTypeFilter = <MultiSelect value={selectedVaccineType} options={vaccineType} onChange={onVaccineTypeChange} optionLabel="name" optionValue="value" placeholder="All" style={{width: '100%'}} />;
    const dateFilter = <Calendar value={selectedDate} onChange={onDateChange} dateFormat="dd-mm-yy" className="p-column-filter" placeholder="Date"/>;

    return (
        <div className="datatable-slots-container">
            <div className="card">
                <DataTable ref={dt} value={dataSet.slotList}
                           paginator rows={10}
                           header={header}
                           className="p-datatable-slots p-datatable-gridlines p-datatable-striped"
                           globalFilter={globalFilter}
                           emptyMessage={dataSet.errorMessage}
                           paginatorPosition="top"
                           alwaysShowPaginator={false}>
                    <Column style={{width : '25%'}} field="name" header="Name" body={BodyTemplates.nameBodyTemplate} sortable/>
                    <Column style={{width : '10%'}} field="pincode" header="Pincode" body={BodyTemplates.pincodeBodyTemplate} sortable/>
                    <Column field="date" header="Date" body={BodyTemplates.dateBodyTemplate} filter filterElement={dateFilter} filterFunction={filterDate} />
                    <Column field="dose" header="Dose (Slots)" body={BodyTemplates.doseBodyTemplate} filter filterElement={doseFilter} />
                    <Column field="fee_type" header="Fee" body={BodyTemplates.feeTypeBodyTemplate} filter filterElement={feeTypeFilter} />
                    <Column field="age" header="Age" body={BodyTemplates.ageLimitBodyTemplate} filter filterElement={ageLimitFilter} />
                    <Column field="vaccine" header="Vaccine" body={BodyTemplates.vaccineTypeBodyTemplate} filter filterElement={vaccineTypeFilter} />
                </DataTable>
            </div>
        </div>
    );
}