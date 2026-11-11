import { cookies } from "next/headers";

export const instant = false;
const SuccessPage = async ({
    searchParams
} : {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {   

    return(
        <>
            <div>
                google success
            </div>
        </>
    )
}

export default SuccessPage