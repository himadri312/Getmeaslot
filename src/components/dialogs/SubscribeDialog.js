import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Card }  from 'primereact/card'
import ReactGA from 'react-ga'

export default function Subscribe({ displaySubscribeDialog, setDisplaySubscribeDialog }) {

    const [subscriberMailId, setSubscriberMailId] = useState('');
    const [subscribedPincodes, setSubscribedPincodes] = useState('');
    const [isValidPincode, setIsValidPincode] = useState(false)

    const validatePincodes = (subscribedPincodes) => {
        setSubscribedPincodes(subscribedPincodes);
        const regex = /^[1-9][0-9]{5}$/;
        setIsValidPincode(subscribedPincodes.split(',').every((pincode) => {
            regex.test(pincode)
            return false;
        }));
    }

    const subscribe = () => {
        ReactGA.event({
            category: 'SUBSCRIBE_DIALOG',
            action: 'Subscribed to notifications',
            label: 'SUBSCRIBE_BUTTON_PRESS'
        })
        subscribedPincodes.split(',').forEach(pincode => {
            if (!pincode.startsWith(0)) {
                console.log(pincode)
            }
        });
    }

    return (
        <React.Fragment>
            <Dialog header="Subscribe slots notification"
                    visible={displaySubscribeDialog}
                    onHide={() => setDisplaySubscribeDialog(false)}
                    resizable={false}
                    breakpoints={{'1200': '75vw', '640px': '100vw'}}
                    style={{width: '30vw'}}>
                <InputText
                    value={subscribedPincodes}
                    onChange={(event) => validatePincodes(event.target.value)}
                    className="p-col-12"
                    placeholder="Enter Pincode(use , for multiple)"
                />
                <InputText
                    value={subscriberMailId}
                    onChange={(event) => setSubscriberMailId(event.value)}
                    className="p-col-12"
                    style={{marginTop: '1rem'}}
                    placeholder="Enter email id"
                />
                <div className="p-col-12" style={{padding: '0.5rem 0'}}>
                    <Button
                        label="Subscribe"
                        className="p-button p-col-12"
                        onClick={subscribe}
                        style={{marginTop: '0.5rem'}}
                        disabled={!isValidPincode}
                    />
                </div>
                <Divider className="p-mt-2"/>
                <Card className="disclaimer">
                    <p className="stoppedService">
                        <h1>Our apologies!</h1>
                        <h4>We have stopped slots availability notification service, as vaccines are readily available in most of the districts.</h4>
                        <h4>You can still use the search option.</h4>
                    </p>
                    <p>Users can subscribe to multiple pincodes</p>
                    <p>User will get an email notification as soon as slots for a subscribed pincode is available</p>
                    <p>Disclaimer : Due to high demand, slot availability on CoWin changes rapidly. Please book the slots on CoWin as soon as they are available.</p>
                </Card>
            </Dialog>
        </React.Fragment>
    )
}
