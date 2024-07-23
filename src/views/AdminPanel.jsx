import {hasPermission} from "../utils/permissions.jsx";

export default function AdminPanel() {
    if (!hasPermission(['view_adminpanel'])) {
        return <div>You do not have access to this section.</div>;
    }
    return(
            <div>
                AdminPanel
            </div>
    )
}