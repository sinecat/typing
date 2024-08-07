'use client'
import React, {ComponentProps, useEffect, useMemo, useRef, useState} from 'react';
import './styles.css'
import {TextDataType} from "@/constants/common";

type TextBoardProps = ComponentProps<any> & {
    inputValue: string;
    targetValue: any[];
    onClick: () => void;
    focus?: boolean;
}

const TextBoard = (props: TextBoardProps) => {
        const {inputValue, targetValue, onClick, focus} = props;
        const inputLettersValueArr = inputValue.split('');
        const targetValueLength = targetValue?.map((item: TextDataType) => item.value).join('').length
        const textBoardRef = useRef<HTMLDivElement>(null)
        const [letterDomArr, setLetterDomArr] = useState<any>()

        const caretPosition = useMemo(() => {
            const currentCaretIndex = inputValue.length || 0;
            const currentLetterDom = letterDomArr?.[currentCaretIndex];
            let result = {
                left: '0px',
                top: '0px'
            }
            if (currentCaretIndex === targetValueLength && textBoardRef.current) {
                const textBoardRect = textBoardRef.current.getBoundingClientRect();
                const caretRect = letterDomArr[targetValueLength - 1]?.getBoundingClientRect();
                const caretLeft = caretRect.right - textBoardRect.left;
                const caretTop = caretRect.top - textBoardRect.top;
                result = {
                    left: `${caretLeft}px`,
                    top: `${caretTop}px`
                }
                return result
            }
            if (textBoardRef.current && currentLetterDom) {
                const textBoardRect = textBoardRef.current.getBoundingClientRect();
                const caretRect = currentLetterDom.getBoundingClientRect();
                const caretLeft = caretRect.left - textBoardRect.left;
                const caretTop = caretRect.top - textBoardRect.top;
                result = {
                    left: `${caretLeft}px`,
                    top: `${caretTop}px`
                }
            }
            return result
        }, [inputValue, letterDomArr, targetValueLength])

        const getTextStartIndex = (index: number) => {
            let startIndex = 0
            for (let i = 0; i < index; i++) {
                startIndex += targetValue[i].value.length
            }
            return startIndex
        }

        useEffect(() => {
            let letterDomArr = document.querySelectorAll('.letter')
            setLetterDomArr(letterDomArr)
        }, [targetValue])

        return (
            <div className='w-[1024px]'>
                <div className='text-board flex flex-wrap gap-4' ref={textBoardRef} onClick={onClick}>
                    {focus ?
                        <div className='caret animate-opacity'
                             style={{left: caretPosition.left, top: caretPosition.top}}></div> : null}
                    {
                        targetValue?.map((value: TextDataType, index: number) => {
                            const currentInputTextStartIndex = getTextStartIndex(index);
                            const currentInputTextEndIndex = currentInputTextStartIndex + value.value.length;
                            const currentInputTextValueArr = inputLettersValueArr.slice(currentInputTextStartIndex, currentInputTextEndIndex)
                            const targetTextValueArr = value.value.split('');
                            let currentTextColor = 'no-input';
                            const inputText = currentInputTextValueArr.join('');
                            const valueText = value.value;
                            if (valueText?.includes(inputText)) {
                                currentTextColor = valueText?.length === inputText.length ? 'primary' : 'no-input';
                            } else {
                                currentTextColor = inputText ? 'danger' : 'no-input';
                            }
                            return (
                                <div key={index} className='word flex flex-col gap-1 text-xl text-center'>
                                    <div className={`label ${currentTextColor}`}>{value.text}</div>
                                    <div className='letters flex gap-0.5'>
                                        {
                                            targetTextValueArr.map((letter: string, _index: number) => {
                                                let currentColor = '';
                                                if (currentInputTextValueArr[_index]) {
                                                    if (currentInputTextValueArr[_index] === targetTextValueArr[_index]) {
                                                        currentColor = 'primary';
                                                    } else {
                                                        currentColor = 'danger';
                                                    }
                                                } else {
                                                    currentColor = 'no-input';
                                                }
                                                return (
                                                    <div key={letter + _index}
                                                         className={`letter inline-block text-left font-semibold ${currentColor}`}>
                                                        {letter}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
;

export default TextBoard;