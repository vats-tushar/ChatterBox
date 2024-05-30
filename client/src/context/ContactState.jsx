import ContactContext from './contactContext.jsx';

import React, { useState } from 'react'

const ContactState = (props) => {
    const host = "http://localhost:3000";
    const contsInitial = [];
    const [contacts, setContacts] = useState(contsInitial);
    const [msgList, setMsgList] = useState(contsInitial);
    


    //get all contacts
    const getContacts = async ()=>{
        if(localStorage.getItem('token')){
            const url = `${host}/api/contacts/getcontacts`;
            const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            setContacts(json);
        }
        else setContacts([]);
    }

    //add contact
    const addContact = async (name, email)=>{
        const url = `${host}/api/contacts/savecontact`;
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({name, email})
        })
        getContacts();
    }

    const getMessages = async (id)=>{
        const url = `${host}/api/chat/getmsgs`;
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({id})
        });
        const json = await response.json();
        setMsgList(json);
        console.log(json);

    }

    const saveMessages = async (msg)=>{
        console.log(msg.viewed)
        const url = `${host}/api/chat/savemsgs`;
        await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: !msg.isSent ? JSON.stringify({msgText: msg.msgText, isSent: msg.isSent, oppId: msg.oppId, viewed:msg.viewed}) : JSON.stringify({msgText: msg.msgText, isSent: msg.isSent, oppId: msg.oppId})
        });
    }

    const saveUnreadMessages = async (msg)=>{
        const url = `${host}/api/chat/saveunreadmsgs`;
        await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({msgText: msg.msgText, isSent: msg.isSent, oppId: msg.oppId})
        });
    }

    const viewMessage = async (id)=>{
        const url = `${host}/api/chat/viewmsg`;
        await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({msgid:id})
        });
        console.log("yay");
    }

    return (
        <ContactContext.Provider value={{contacts, getContacts, addContact, getMessages, saveMessages, msgList, setMsgList, saveUnreadMessages, viewMessage}}>
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState;