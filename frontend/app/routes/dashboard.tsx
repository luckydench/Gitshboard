import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import Header from "~/components/common/Header";
import DashboardSection from "~/components/dashboard/DashboardSection";
import useGithubUser from "~/hooks/useUser";
import useErrorCallback from "~/hooks/useErrorCallback";



function OnSetFetchMode(e : React.MouseEvent<HTMLButtonElement>, setFetchMode : React.Dispatch<React.SetStateAction<1|2|3>>){
    const val = e.currentTarget.value
    setFetchMode(Number(val) as 1|2|3);
}


export default function Dashboard(){
    const navigate = useNavigate();
    const { userDataState, isLoading, isError} = useGithubUser();


    useErrorCallback(isError, ()=>{
        navigate("/");
    })
    
    if(isLoading){
        return(
            <Loading/>
        )
    }
    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">

            <Header/>
            <DashboardSection userDataState={userDataState!} loading={isLoading} />


        </div>
    );
}
