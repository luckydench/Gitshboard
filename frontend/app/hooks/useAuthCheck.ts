import {useEffect, useState }  from "react";

type CommonResponse = { success: boolean; } | { error: string; }

export default function useAuthCheck(){
    
    const [loginCheckState, setLoginCheckState] = useState<boolean | null>(null);

    
      useEffect(()=>{
        const checkLogin = async ()=>{
          try{
             const res = await fetch('http://localhost:3000/api/auth/check',{
                method : 'GET',
                credentials : 'include'
             })
    
             if(res.ok){
                const data : CommonResponse = await res.json();
                if('success' in data && data.success){
                  setLoginCheckState(true);
                }
             }
             else{
                  throw new Error("Unauthorized");
             }
          }
          catch(error : unknown){
            console.error("Error : Token verification error", error);
            setLoginCheckState(false);
          }
        } 
    
        checkLogin();
    
      }, [])
    
      return{
        loginCheckState,
      }
}