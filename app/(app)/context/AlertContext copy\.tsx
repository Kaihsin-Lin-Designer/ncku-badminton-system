'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { TriangleAlertIcon, CircleQuestionMarkIcon, CircleCheck, Info, CircleX } from 'lucide-react'
import { cn } from "cn";

type Alert = {
    type: "default" | "ok" | "info" | "warning" | "danger"
    title: string | null,
    message: string | null,
}

type AlertContextValue = {
    alert: Alert,
    setAlert: (value: Alert) => void
}

const AlertContext = createContext<AlertContextValue | null>(null);


export const AlertContextProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const [alert, setAlert] = useState<Alert>({
        type: "danger",
        title: "",
        message: ""
    })
    return <AlertContext.Provider value={{alert: alert, setAlert: setAlert}}>{children}</AlertContext.Provider>
}


export const useAlertContext = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error('useAlert must be used in <AlertContextProvider>')
    return ctx;
}

export const AlertUi = () => {
    const {alert} = useAlertContext();

    return(
        <Alert className={cn(
            "*:[svg]:row-span-1 fixed top-[72px] left-1/2 -translate-x-1/2 z-50 max-w-lg",
            alert.type == "default" && "",
            alert.type == "ok" && "border-green-600 text-green-600",
            alert.type == "info" && "border-sky-600 text-sky-600",
            alert.type == "warning" && "border-amber-600 text-amber-600",
            alert.type == "danger" && "border-red-600 text-red-600",
        )}>
            {alert.type == "default" && <CircleQuestionMarkIcon/>}
            {alert.type == "ok" && <CircleCheck/>}
            {alert.type == "info" && <Info/>}
            {alert.type == "warning" && <TriangleAlertIcon /> }
            {alert.type == "danger" && <CircleX/>}
            <AlertTitle>
                {alert.title}
            </AlertTitle>
            <AlertDescription>
                {alert.message}
            </AlertDescription>
        </Alert>
    )
}