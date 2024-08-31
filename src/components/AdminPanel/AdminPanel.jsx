import {hasPermission} from "../../utils/permissions.jsx";
import './adminpanel.css'; // Import animation styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome icons

export default function AdminPanel() {
    if (!hasPermission(['view_admin'])) {
        return <div>You do not have access to this section.</div>;
    }

    return(
        <div>
            Admin Panel
        </div>
    )
}