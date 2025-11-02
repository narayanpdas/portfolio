import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';

const Home: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 350);
        return () => clearTimeout(t);
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="home">
            <div className="page-title page-title--center" style={{ fontFamily: "cursive" }}>
                <h1>Welcome Traveler!</h1>
            </div>

            <div className="coffee-mug">
                <div className="coffee-mug__steam"></div>
                <div className="coffee-mug__steam"></div>
                <div className="coffee-mug__steam"></div>
                <div className="coffee-mug__body">
                    <div className="coffee-mug__face" aria-hidden="true">
                        <span className="coffee-mug__eye coffee-mug__eye--left">
                            <span className="coffee-mug__pupil" />
                        </span>
                        <span className="coffee-mug__mouth" />
                        <span className="coffee-mug__eye coffee-mug__eye--right">
                            <span className="coffee-mug__pupil" />
                        </span>
                    </div>
                </div>
                <div className="coffee-mug__handle"></div>
            </div>

            <p style={{
                textAlign: 'center', marginTop: '2rem',
                fontWeight: "bold", fontFamily: "cursive",
                fontSizeAdjust: "from-font",
                fontStyle: "italic",
                fontSize: "1.4rem"
            }}>
                Hi, I'm Narayan, a Backend-AI Engineer<br />
                I build, From Logits to production-ready APIs<br />
                Before you explore the page, Here is a
            </p>
            <p style={{ textAlign: 'center', fontWeight: "bolder", fontSize: "1.4rem" }}>Cup of Coffee for You!</p>
        </div>
    );
};

export default Home;