import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div>
            <h2>Dogs</h2>
            <Link to='/home'>
                <button>WELCOME</button>
            </Link>
        </div>
    );
};

export default Landing;