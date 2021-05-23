import React, { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button'
import SearchDialog  from '../dialogs/SearchDialog'
import SubscribeDialog from '../dialogs/SubscribeDialog'
import ReactGA from 'react-ga'

export default function AppMenuBar({ states, setDataSet }) {
    const [displaySearchDialog, setDisplaySearchDialog] = useState(false)
    const [displaySubscribeDialog, setDisplaySubscribeDialog] = useState(false)

    useEffect(() => {
        setDisplaySearchDialog(true);
    }, [])

    const handleSearchButtonAction = () => {
        updateAnalytics("MENUBAR", "clicked on search slots button", "SEARCH_DIALOG_OPENED")
        setDisplaySearchDialog(true)
    }

    const handleSubscribeButtonAction = () => {
        updateAnalytics("MENUBAR", "clicked on notify slots button", "SUBSCRIBE_DIALOG_OPENED")
        setDisplaySubscribeDialog(true)
    }

    const updateAnalytics = (category, action, label) => {
        ReactGA.event({category, action, label})
    }
    const items = [
        {
            template: () => {
                return (
                    <React.Fragment>
                        <Button label="Search Slots" icon="pi pi-bell" className="p-button-raised p-mr-2" onClick={() => handleSearchButtonAction()}/>
                        <SearchDialog statesList={states}
                                      setDataSet={setDataSet}
                                      displaySearchDialog={displaySearchDialog}
                                      setDisplaySearchDialog={setDisplaySearchDialog}/>
                    </React.Fragment>
                )
            }
        },
        {
            template: () => {
                return (
                    <React.Fragment>
                        <Button label="Notify Slots" icon="pi pi-bell" className="p-button-raised p-mr-2" onClick={() => handleSubscribeButtonAction()}/>
                        <SubscribeDialog displaySubscribeDialog={displaySubscribeDialog}
                                         setDisplaySubscribeDialog={setDisplaySubscribeDialog}/>
                    </React.Fragment>
                )
            }
        },
        /*{
            template: () => {
                return (<Button label="About Us" icon="pi pi-users" className="p-button-raised p-mr-2"/>);
            }
        },
        {
            template: () => {
                return (<Button label="Donate" icon="pi pi-bell" className="p-button-raised p-mr-2"/>);
            }
        }*/
    ]

    return (
        <React.Fragment>
            <div className="card appMenuBar">
                <Menubar model={items}/>
            </div>
        </React.Fragment>
    )
}
