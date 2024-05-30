import React, {useMemo, useEffect, useState, useRef, useContext} from 'react'
import io from 'socket.io-client';
import './home.css';
import { useNavigate } from 'react-router-dom';
import contactContext from '../context/contactContext';
import ChatArea from './ChatArea';

export default function Home() {

    const socket = useMemo(()=> io("http://localhost:3000"),[]);

    const [room, setRoom] = useState('');
    const [sID, setSID] = useState('');
    const [chatwith, setChatwith] = useState('');
    const [chatopened, setChatopened] = useState('');
    

    const navigate = useNavigate();
    const context = useContext(contactContext);
    const { contacts, getContacts,addContact, saveMessages, getMessages, msgList, setMsgList, saveUnreadMessages } = context;
    const ref = useRef(null);
    const ref2 = useRef(null);
  
    useEffect(()=>{
      if(localStorage.getItem('token')==null){
        navigate("/login");
      }

      getContacts();

      let uri = "http://localhost:3000/api/socketID/storeID";
      async function storingid(id){
        console.log(id);
        const response2 = await fetch(uri, {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            "auth-token": localStorage.token,
          },
          body: JSON.stringify({id: id})
        });
      }
      
      socket.on("connect",()=>{
        setSID(socket.id);
        storingid(socket.id);
        console.log("connected");
      })
      socket.on("welcome",(s)=>{
        console.log(s);
      })

      socket.on("recieve",(data)=>{
        setMsgList((msgList)=>[...msgList,data]);
        data.viewed = 1;
        saveMessages(data);
      })
  
      return ()=>{
        socket.disconnect();
      }
    },[]);
  
    const handleSubmit = async (e)=>{
      e.preventDefault();
      let uri = "http://localhost:3000/api/socketID/getid";
      let sockId = await fetch(uri, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: room})
      })
      const json = await sockId.json();
      let receiver = await json.sockid;
      let msg = {
        msgText: e.target[0].value,
        isSent: false,
        oppId: localStorage.logged
      };
      let data={msgText: e.target[0].value, isSent: true, oppId: room}

      saveMessages(data);
      e.target[0].value='';

      if(receiver!=="null"){
        socket.emit('message',{msg, receiver});
      }
      else{
        console.log("hry");
        data.isSent=false;
        saveUnreadMessages(data);
      }

      setMsgList([...msgList,data]);
    }

    async function deletingid(id){
      let uri = "http://localhost:3000/api/socketID/storeID";
      const response2 = await fetch(uri, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          "auth-token": localStorage.token,
        },
        body: JSON.stringify({id: id})
      });
    }

    const logout = ()=>{
      deletingid(null);
      localStorage.removeItem('token');
      navigate("/login");
    }
    const startnew = ()=>{
      ref.current.click();
    }
    const handleClick = ()=>{
      ref2.current.click()
    }
    const storecontact = (e)=>{
      e.preventDefault();
      addContact(e.target[0].value, e.target[1].value);
    }
  
    return (
      <div>
        
        <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Start New Chat</h1>
                </div>
                <div className="modal-body">
                <form onSubmit={storecontact}>

                    <div className="mb-3">
                        <label htmlFor="etitle" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="etitle"
                            name="etitle"
                            aria-describedby="emailHelp"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="edescription" className="form-label">
                            Email
                        </label>
                        <input
                            type='text'
                            className="form-control"
                            id="edescription"
                            name="edescription"
                            rows="4"
                        />
                    </div>
                    <button type='submit' ref={ref2} style={{display: 'none'}}>Submit</button>

                </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleClick} data-bs-dismiss="modal">Save</button>
                </div>
                </div>
            </div>
        </div>

        <div className='nav'>
          <div className="brand">ChatterBox</div>
          <button className='box logout' onClick={logout}>Logout</button>
        </div>
        <div className='fullwindow'>
          <div className="leftchats">
            <div className='chatshead'>
              <div>Chats</div>
              <div className='startnew'><i className="fa-solid fa-plus" onClick={startnew}></i></div>
            </div>
            <div className='hr'></div>
            <div className='chatlist'>
              {contacts.map((cont,index)=>{
                return <div key={index} className='contact' onClick={()=>{getMessages(cont.contactid); setChatwith(cont.contname); setChatopened(true); setRoom(cont.contactid)}}>
                  <div>{cont.contname}</div>
                </div>
              })}
            </div>
          </div>
          <ChatArea chatwith={chatwith} chatopened={chatopened} handleSubmit={handleSubmit} room={room}/>
        </div>
      </div>
    )
}
