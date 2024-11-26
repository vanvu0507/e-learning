import { Fragment } from "react";
import { useLocation, Navigate } from "react-router-dom";


function RouteGuard({authenticated, user, element, requiredRole}) {
    const location = useLocation();

    if(!authenticated && !location.pathname.includes('/auth')) {
        return <Navigate to='/auth' />
    }

    if (authenticated && user?.role !== 'admin' && user?.role !== 'instructor' && 
        (location.pathname.includes('instructor') || location.pathname.includes('admin') || location.pathname.includes('/auth'))) {
        return <Navigate to='/home' />;
    }

    if(authenticated && user.role === 'instructor' && !location.pathname.includes('instructor')) {
        return <Navigate to='/instructor' />
    }
    
    if(authenticated && user.role === 'admin' && !location.pathname.includes('instructor')) {
        return <Navigate to='/instructor' />
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to='/instructor' />;
    }

    return <Fragment>{element}</Fragment>
}

export default RouteGuard;