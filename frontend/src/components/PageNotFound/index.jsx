import { useHistory } from "react-router-dom";
import "./PageNotFound.css";
import globe from "../Images/page-not-found-globe.png";

const PageNotFound = () => {
  const history = useHistory()
  
  return (
    <div className='page-not-found'>
      <div className='content'>
        <img src={globe} alt="globe" />
        <h1>Page not found</h1>
        <p>We can't seem to find the page you are looking for.</p>
        <button onClick={() => history.push("/")}>Home</button>
      </div>
    </div>
  )
}

export default PageNotFound