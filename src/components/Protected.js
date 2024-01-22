import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SideBar from './SideBar/SideBar'

function Protected(props){
    const authToken = Cookies.get('authToken');
    const navigate = useNavigate();
    const {Component} = props;
    useEffect(() => {
        if(!authToken) {
            navigate('/login');
        }
    }, [navigate, authToken])
    
    return(
        <><SideBar />
            <div className="p-6 sm:ml-64">
                <Component /> 
            </div>
        </>
    ) 
}

export default Protected;