import { useNavigate } from "react-router-dom";

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
            backgroundColor: '#2c3e50'
        }}>
            <button className="card" style={{ width: '400px', maxWidth: '90vw' }} onClick={handleGetStarted}>
                Get Started
            </button>
        </div>
    )
}

export default LandingPage;