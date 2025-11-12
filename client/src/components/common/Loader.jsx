import './Spinner.css';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="full-screen-overlay">
      <div className="spinner"></div>
      <div>{message}</div>
    </div>
  );
};

export default Loader;
