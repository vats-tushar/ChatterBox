
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './login.css'

export default function Login() {
    const [cred, setCreds] = useState({email: "", password: ""});
    const navigate = useNavigate();

    const onChange=(e)=>{
        setCreds({...cred, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        localStorage.setItem('logged',cred.email);
        const url = `http://localhost:3000/api/auth/login`;
        const response1 = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: cred.email, password: cred.password})
        });
        const json= await response1.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token', json.authToken);
            console.log("Youre logged in","success");
            
            navigate("/home");
        }
        else{
            console.log("error")
        }

    }
  return (
    <div id='login-page'>
      <div className="container">
	    <div className="screen">
		    <div className="screen__content">
			    <form className="login" onSubmit={handleSubmit}>
				    <div className="login__field">
					    <i className="login__icon fas fa-envelope"></i>
					    <input type="email" className="login__input" placeholder="Email" id='email' name='email' onChange={onChange} value={cred.email} required/>
				    </div>
				    <div className="login__field">
					    <i className="login__icon fas fa-lock"></i>
					    <input type="password" className="login__input" placeholder="Password" id='password' name='password' onChange={onChange} value={cred.password} required minLength={5}/>
				    </div>
				    <button type='submit' className='box'>Log In</button>
			    </form>
          <br/><div style={{paddingLeft: '30px', paddingTop: '10px'}}>Not a user? <Link to='/signup'>Sign up</Link></div>
		    </div>
		    <div className="screen__background">
			    <span className="screen__background__shape screen__background__shape3"></span>		
			    <span className="screen__background__shape screen__background__shape2"></span>
			    <span className="screen__background__shape screen__background__shape1"></span>
		    </div>		
	        </div>
        </div>
    </div>
  )
}
