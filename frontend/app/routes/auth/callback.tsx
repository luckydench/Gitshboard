import  {useEffect, useRef} from 'react'
import {useSearchParams, useNavigate} from 'react-router';

export default function Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const didRun = useRef(false);

    // Github OAuth가 리다이렉트 될 때는 URL "code"쿼리 파라미터로 
    // 인증 코드가 전달됨
    const code = searchParams.get('code');
    console.log("Received code:", code);

    useEffect(()=>{
        if(didRun.current) return;
        didRun.current = true;

        const authenticate = async()=>{
            // error
            if(!code){
                console.error("code가 URL에 없음");
                navigate('/');
                return;
            }

            try{
                const local_url = "http://localhost:3000";
                const prod_url  = "https://port-0-gitshboard-mqw7zlvy6c191acf.sel3.cloudtype.app";
                const backend_url = prod_url; // 개발 환경에서는 local_url 사용

                console.log("Using backend URL:", backend_url);
                // 백엔드에 인증 코드 보내서 서버 액세스 토큰 받아오기
                // 참고로 http:// 로 //를 다 써줘야 절대 경로로 인식됨
                const response = await fetch(`${backend_url}/api/auth/github`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({code}),
                    credentials : 'include'
                })

                if(response.ok){
                    const data = await response.json();
                    //access token을 httponly 쿠키로 전환할 예정
                    // const { token } = data;
                    // localStorage.setItem('github_token', token);
                    console.log("인증 성공", data);
                    navigate('/dashboard', {replace : true});
                }
                else{
                    throw new Error(`인증 실패: ${response.statusText}`);
                }
            }
            catch(error){
                console.error("인증 실패", error);
                alert("로그인에 실패했습니다 :" + error);
                navigate('/');
            }
        }

        authenticate();

    },[])

    return(
        <div className = "flex justify-center items-center h-screen">
            <h1>로딩 중...</h1>
        </div>
    )
}