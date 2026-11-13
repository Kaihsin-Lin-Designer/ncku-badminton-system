'use client'
import { FormRow } from "@/components/custom/Form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Separator } from "@/components/ui/separator"
import { useState, useTransition, useRef } from "react"
import { PaginatedDocs } from "payload"
import { payloadQueryUsers } from "@/lib/users/payload-query"
import { UserProfile } from "@/payload-types"


export const RegisterForm = () => {
    const departments: string[] =[];
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isPending, startTransition] = useTransition();
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
    const latestRef = useRef('')

    const handleSearchUsers = (value: string) => {
        const q = value.trim()
        latestRef.current = q
        if (timerRef.current) clearTimeout(timerRef.current)

        if (q.length < 1) {
            setUsers([])
            return
        }

        timerRef.current = setTimeout(() => {
            startTransition(async () => {
                const result = await payloadQueryUsers(q)
                if (latestRef.current !== q) return   // 輸入已改變，丟棄舊結果
                startTransition(() => {
                    setUsers(result ?? [])
                })
            })
        }, 300)
    }

    return(
        <form>
            <div
                className="flex flex-col gap-6 my-6"
            >

                <FormRow>
                    <Label>
                        姓名
                    </Label>
                    <div className='flex gap-2'>
                        <Input type="text" id="family_name" name="family_name" placeholder="姓" className="flex-1"/>
                        <Input type="text" id="given_name" name="given_name" placeholder="名字" className="flex-2"/>
                    </div>
                </FormRow>
                <FormRow>
                    <Label htmlFor="nickname">
                        暱稱
                        <Tooltip>
                            <TooltipTrigger render={<Info size={16}/>}></TooltipTrigger>
                            <TooltipContent>暱稱會作為您向其他會員顯示的主要名稱</TooltipContent>
                        </Tooltip>
                    </Label>
                    <Input type="text" id="nickname" name="nickname" placeholder="阿昕" className="flex-1"/>
                </FormRow>
                <FormRow>
                    <Label>
                        系級
                    </Label>
                    <div className="flex gap-2">
                        <Combobox items={departments}>
                            <ComboboxInput placeholder="選擇系所" className="flex-2"/>
                            <ComboboxContent>
                                <ComboboxEmpty>新增一個？</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <Input type="number" id="class_of" name="class_of" placeholder="111" min={10} max={999} className="flex-1"/>
                    </div>
                </FormRow>
                <Separator/>
                <FormRow>
                    <Label htmlFor="">
                        推薦人
                        <Tooltip>
                            <TooltipTrigger render={<Info size={16}/>}></TooltipTrigger>
                            <TooltipContent>推薦人會負責驗證您是否為校友</TooltipContent>
                        </Tooltip>
                    </Label>
                    <Combobox items={users} itemToStringLabel={(item: UserProfile) => item.full_name ?? ""}>
                        <ComboboxInput placeholder="選擇校友" className="flex-2" onChange={(e) => handleSearchUsers(e.currentTarget.value)}/>
                        <ComboboxContent>
                            <ComboboxEmpty>查無此人</ComboboxEmpty>
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item.full_name}
                                        {item.nickname && ` (${item.nickname})`}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </FormRow>
            </div>

        </form>
    )
}
