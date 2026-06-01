import { Outlet } from "react-router";
import { NavFloatButton } from "../common/NavFloatButton";
import useRenderingTimer from "~/hooks/dev/useRenderingTimer";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../common/Header";



export type FloatState = "1" | "2" | "3";

export default function DashboardLayout(){
    const [resetTrigger, setResetTrigger] = useState(false);
    const render_time = useRenderingTimer("DashboardLayout", resetTrigger, setResetTrigger);
    const [floatState, setFloatState] = useState<FloatState>("1");
    const queryClient = new QueryClient();

    return(
        <QueryClientProvider client ={queryClient}>
            <Header/>
            <Outlet context={floatState}/>
            <NavFloatButton 
                onFetchClick={(e)=>{ 
                    const value : FloatState= e.currentTarget.value as FloatState;
                    console.log("Fetch Button Clicked with value:", value);
                    setFloatState(value);
                    setResetTrigger(true); // Toggle resetTrigger to reset the timer
                }}
                render_time={render_time}
                />
        </QueryClientProvider>
    )
}