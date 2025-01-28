import { useState } from "react"
import "./homepage.css"
import { Link } from "react-router-dom"
import { TypeAnimation } from "react-type-animation"

const HomePage = () => {

    // const test = async () =>{
    //     await fetch("http://localhost:3000/api/test",{
    //         credentials: "include",
    //     })
    // }

    const [typingStatus,setTypingStatus]=useState("bear1")
    return (
        <div className= "homepage"> 
        <img src="/ele.webp" alt="" className="ele" />
        <div className="left">
            <h1>HELLOHI AI</h1>
            <h2>Lonely?, Need help, I'm here for you!</h2>
            <h3>Powered by Google Gemini
            </h3>
            <Link to="/dashboard">Get Started</Link>
        </div>
        
        <div className="terms">
            <img src="/logo.png" alt="" />
            <div className="links">
                <Link to="/">Terms of Service</Link>
                <Link to="/">Privacy Policy</Link>
            </div>
        </div>
        </div>
    )
}

export default HomePage