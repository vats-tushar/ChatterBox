import {useContext} from 'react';
import contactContext from '../context/contactContext';
import './chatarea.css';

const ChatArea = (props) => {
    const context = useContext(contactContext);
    const { msgList, viewMessage } = context;
  return (
    <div className='rightchat'>
      {props.chatopened && <div><div className='contname' style={{zIndex: '99'}}>{props.chatwith}</div>
      <div className="messages">
        {msgList.map((data,index)=>{
          
            if(data.oppId===props.room){
              viewMessage(data.msgid);
              setTimeout(() => {
                if(data.viewed==='0'){data.viewed='1'}
              }, 2000);
            return <div key={index+99} className={data.isSent==='true' || data.isSent===true ? "sent" : "received"}>
                <div></div>
                <div className={`chatitem ${data.viewed==='0' ? 'msgcolred': 'msgcolblue'}`}>{data.msgText}</div>
            </div>} 
        })}
      </div>
      <form className='sendbox'onSubmit={props.handleSubmit}>
        <input type='text' placeholder='Message...' className='sendarea'/>
        <button type='submit' className='submitbtn'><i className="fa-regular fa-paper-plane"></i></button>
      </form></div>}
    </div>
  )
}

export default ChatArea;