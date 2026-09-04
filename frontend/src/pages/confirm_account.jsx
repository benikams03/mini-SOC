import { useSearchParams, useNavigate} from "react-router-dom";
import { useEffect } from "react";

export default function ConfirmAccount() {

    const [ searchParams ] = useSearchParams()
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    const navigate = useNavigate()

    useEffect(()=>{
        
        localStorage.setItem('access_token', access_token)
        navigate('/admin')
        
    },[]) 

    return (<></>);
}