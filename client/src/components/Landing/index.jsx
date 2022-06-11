import { Link } from 'react-router-dom';
import style from "./landing.module.css";
function Landing() {
    return (
        <div className={style.mainContainer}>
            <h1 className={style.title}>Henry Dogs</h1>
            <Link to='/home'>
                <button className={style.button}><h2>WELCOME</h2></button>
            </Link>
        </div>
    );
};

export default Landing;