import { getLoggedUser } from "@/utils/jwtUtil";
import { useEffect } from "react";
import { useNavigate } from "react-router"

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => { 
        const loggedUser = getLoggedUser()
        console.log(loggedUser);
        if (loggedUser) {
			navigate("/org");
            return;
        }

        navigate("/login");
        
    },[])



  return (
    <div>Home</div>
  )
}
