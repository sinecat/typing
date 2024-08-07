'use client'

import React, {useEffect, useState} from 'react';
import './styles.css'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import HotWordsTextTypingBox from "@/components/HotWordsTextTypingBox";

const Page = () => {

    return (
            <div className='w-full flex p-10 items-center justify-center'>
                <Tabs defaultValue="chinese" className="w-full items-start">
                    <TabsList>
                        <TabsTrigger value="chinese">Chinese Hot Words</TabsTrigger>
                        <TabsTrigger value="english">English Sentence</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chinese">
                        <HotWordsTextTypingBox />
                    </TabsContent>
                    <TabsContent value="english">Developing</TabsContent>
                </Tabs>
            </div>
    );
};

export default Page;