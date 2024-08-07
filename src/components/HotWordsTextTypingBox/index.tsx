import React, {useEffect, useRef, useState} from 'react';
import useTimer from "@/hooks/timer";
import {getRandomData} from "@/utils/getRandomData";
import {textData} from "@/constants/textData-zh";
import {TextDataType} from "@/constants/common";
import {Separator} from "@/components/ui/separator";
import TextBoard from "@/components/TextBoard";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Terminal} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useToast} from "@/components/ui/use-toast";
import './styles.css'

const wordNumsConfig = [3, 20, 30, 40, 50]

const HotWordsTextTypingBox = () => {
    const {toast} = useToast()
    const [targetValue, setTargetValue] = useState<any>()
    const [inputValue, setInputValue] = useState('')
    const [successTextLength, setSuccessTextLength] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isFocus, setIsFocus] = useState(false)
    const [inputting, setInputting] = useState(false)
    const [wordNums, setWordNums] = useState(wordNumsConfig[0])
    const inputRef = useRef<HTMLInputElement>(null)

    const {time, start, pause, reset, end} = useTimer();
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace('\n', '')
        if (value.length > targetValue?.strLength || value.length < successTextLength) return
        if (inputting) {
            setInputValue(value)
        }
    }

    const setInputFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            setIsFocus(true)
            toast({
                title: "TIP",
                description: "Please switch to English input method",
            })
        }
    }

    const handleWordNumsClick = (num: number) => {
        if (wordNums !== num) {
            setWordNums(num)
            setTargetValue(getRandomData(textData, num))
            setInputFocus()
        }
    }

    const handleFreshClick = () => {
        setIsFinished(false)
        setSuccessTextLength(0)
        setTargetValue(getRandomData(textData, wordNums))
        setInputValue('')
        reset()
        setInputFocus()
    }

    const handleTextBoardClick = () => {
        setInputFocus()
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && isFocus) {
            setInputting(true)
            start()
        }
    }

    const handleBlur = () => {
        pause()
        setInputting(false)
        setIsFocus(false)
    }

    useEffect(() => {
        const init = () => {
            setTargetValue(getRandomData(textData, wordNums))

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
            const startIndex = inputValue.indexOf(targetValueArr?.[index])
            const endIndex = startIndex + targetValueArr?.[index]?.length
            const currentStrValue = inputValue.substring(startIndex, endIndex)
            if (currentStrValue && currentStrValue === targetValueArr?.[index]) {
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
        <div>
            <div className='mt-5 p-2 items-start'>
                <div className="flex h-5 items-center space-x-4 font-semibold no-input cursor-pointer">
                    {
                        wordNumsConfig?.map((item, index) => {
                            return (
                                <div key={'word-num-box' + item}>
                                    <div key={'word-num' + item}
                                         className={`${wordNums === item ? 'text-primary' : ''}`}
                                         onClick={() => handleWordNumsClick(item)}
                                    >
                                        {item}
                                    </div>
                                    {index === wordNumsConfig.length - 1 ? null :
                                        <Separator key={'Separator-word-num' + item} orientation="vertical"/>}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='flex flex-col items-center'>
                {isFinished ? '恭喜你，输入完成,用时：' + time : null}
                <TextBoard focus={isFocus} inputValue={inputValue} targetValue={targetValue?.data}
                           onClick={handleTextBoardClick}/>
                <input type="text" value={inputValue} onChange={handleInputChange} className='text-input'
                       ref={inputRef}
                       onBlur={handleBlur} onKeyDown={handleKeyDown}/>
                <Button className='w-30' onClick={handleFreshClick}>Refresh</Button>
                {isFocus && !inputting ? <Alert className='w-80 mt-20 animate-bounce text-lg'>
                    <Terminal className="h-4 w-5"/>
                    <AlertTitle>Ready?</AlertTitle>
                    <AlertDescription className='mt-2 text-lg'>
                        Press <Badge className='bg-gray-100 text-black rounded text-lg font-light'>Enter</Badge> to
                        start typing
                    </AlertDescription>
                </Alert> : null}
            </div>
        </div>
    );
};

export default HotWordsTextTypingBox;