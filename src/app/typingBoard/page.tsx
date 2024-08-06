'use client'

import React, {useEffect, useRef, useState} from 'react';
import {getRandomData} from "@/utils/getRandomData";
import {textData} from "@/constants/textData-zh";
import TextBoard from "@/components/TextBoard";
import './styles.css'
import {Button} from "@/components/ui/button";
import useTimer from "@/hooks/timer";
import {TextDataType} from "@/constants/common";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

const Page = () => {
    const [targetValue, setTargetValue] = useState<any>()
    const [inputValue, setInputValue] = useState('')
    const [successTextLength, setSuccessTextLength] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isFocus, setIsFocus] = useState(false)
    const [inputing, setInputing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const {time, start, pause, reset, end} = useTimer();
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace('\n', '')
        if (value.length > targetValue?.strLength || value.length < successTextLength) return
        if (inputing) {
            setInputValue(value)
        }
    }

    const setInputFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            setIsFocus(true)
        }
    }

    const handleFreshClick = () => {
        setIsFinished(false)
        setSuccessTextLength(0)
        setTargetValue(getRandomData(textData, 30))
        setInputValue('')
        reset()
        setInputFocus()
    }

    const handleTextBoardClick = () => {
        setInputFocus()
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && isFocus) {
            setInputing(true)
            start()
        }
    }

    const handleBlur = () => {
        pause()
        setInputing(false)
        setIsFocus(false)
    }

    useEffect(() => {
        const init = () => {
            setTargetValue(getRandomData(textData, 5))

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
        init()
    }, []);

    // 用于计算输入正确的文字长度，输入正确的文字不可被删除
    useEffect(() => {
        let result = 0
        const inputValueArr = inputValue.split(' ')
        const targetValueArr = targetValue?.data?.map((item: TextDataType) => item.value)
        inputValueArr.forEach((item, index) => {
            if (item === targetValueArr?.[index]?.trim()) {
                result += targetValueArr[index].length
            }
        })
        if (result === targetValue?.strLength && inputValue.endsWith(' ')) {
            setIsFinished(true)
            end()
        }
        setSuccessTextLength(result)
    }, [inputValue, targetValue])

    return (
        <div className='flex flex-col items-center p-10'>
            <div className='w-full flex pb-10'>
                <Tabs defaultValue="account" className="w-[400px] items-start">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            {isFinished ? '恭喜你，输入完成,用时：'+time : null}
            <TextBoard focus={isFocus} inputValue={inputValue} targetValue={targetValue?.data}
                       onClick={handleTextBoardClick}/>
            <input type="text" value={inputValue} onChange={handleInputChange} className='text-input' ref={inputRef}
                   onBlur={handleBlur} onKeyDown={handleKeyDown}/>
            <Button className='w-30 animate-bounce' onClick={handleFreshClick}>Refresh</Button>
            {isFocus && !inputing ? <div>按下回车开始输入</div> : null}
        </div>
    );
};

export default Page;