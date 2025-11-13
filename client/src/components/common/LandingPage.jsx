import { useNavigate } from "react-router-dom";
import "./LandingPageStyle.css"

const LandingPage = () => {

    const navigate = useNavigate();

    const handleGetStarted = () => {

        navigate("/login")
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2c3e50',
            flexDirection: "column"
        }}>
            <img
                src="logo.png"
                alt="Logo"
                width={250}
                height={250}
                className="bounce"
            />
            <button className="card" style={{ width: '400px', maxWidth: '90vw', marginTop: "10vh" }} onClick={handleGetStarted}>
                Get Started
            </button>
            <p style={{
                color: "yellow"
            }}>Centralized platform to book your panel members!</p>
        </div>
    )
}

export default LandingPage;