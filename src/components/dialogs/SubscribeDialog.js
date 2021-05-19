import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

export default function Subscribe({ displaySubscribeDialog, setDisplaySubscribeDialog }) {

    const [subscriberMailId, setSubscriberMailId] = useState('');
    const [subscribedPincodes, setSubscribedPincodes] = useState('');
    const [isValidPincode, setIsValidPincode] = useState(false)

    const validatePincodes = (subscribedPincodes) => {
        setSubscribedPincodes(subscribedPincodes);
        const regex = /^[1-9][0-9]{5}$/;
        setIsValidPincode(subscribedPincodes.split(',').every((pincode) => {
            return regex.test(pincode)
        }));
    }

    const subscribe = () => {
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
                    placeholder="Enter Pincode(use , from multiple)"
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
            </Dialog>
        </React.Fragment>
    )
}
