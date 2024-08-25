import {hasPermission} from "../utils/permissions.jsx";
import {useEffect, useState} from "react";
import '../styles/adminpanel.css'; // Import animation styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome icons

export default function AdminPanel() {
    if (!hasPermission(['view_adminpanel'])) {
        return <div>You do not have access to this section.</div>;
    }

    // eslint-disable-next-line react/prop-types
    const Counter = ({ iconClass, end, duration, title }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let start = 0;
            const incrementTime = duration / end;

            const timer = setInterval(() => {
                start += 1;
                setCount(Math.ceil(start));
                if (start >= end) clearInterval(timer);
            }, incrementTime);

            return () => clearInterval(timer);
        }, [end, duration]);

        return (
            <div className="col-md-3 col-sm-6 bottom-margin text-center counter-section animate__animated animate__fadeInUp">
                <i className={`fas ${iconClass} medium-icon`}></i>
                <span className="counter-number">{count}</span>
                <p className="counter-title">{title}</p>
            </div>
        );
    };

    return(
        <div>
            <section className="animate__animated animate__fadeIn">
                <div className="container">
                    <div className="row">
                        <Counter iconClass="fa-user" end={1} duration={4000} title="Students"/>
                        <Counter iconClass="fa-graduation-cap" end={0} duration={4000} title="Teachers"/>
                        <Counter iconClass="fa-person" end={0} duration={4000} title="Secretaries"/>
                        <Counter iconClass="fa-user-tie" end={1} duration={4000} title="Administrators"/>
                    </div>
                </div>
            </section>
        </div>
    )
}