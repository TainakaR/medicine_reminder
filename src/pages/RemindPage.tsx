import React from "react";
import { ReminderItem } from "../components/ReminderItems";
import type { Reminder } from "../types";

type RemindData = {
    first: Reminder[];
    long: Reminder[];
};

type Props = {
    // App.tsxから渡されるデータ
    data: RemindData; 
    // App.tsxから渡される完了処理関数
    onComplete: (id: string) => void;
    // ボタンテキスト (App.tsxで指定)
    completeButtonText: string; 
};

export const RemindPage: React.FC<Props> = ({
    data,
    onComplete,
    completeButtonText,
}) => {
    const totalCount = data.first.length + data.long.length;

    if (totalCount === 0) {
        return (
            <div className="py-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">リマインド対象一覧</h2>
                <p className="text-gray-400">現在、リマインド対象のデータはありません。</p>
            </div>
        );
    }

    // 1. 初めての薬 リスト
    const FirstList = data.first.map((item) => (
        <ReminderItem
            key={item.id}
            data={item}
            onComplete={onComplete}
            completeButtonText={completeButtonText}
        />
    ));

    // 2. 長期の薬 リスト
    const LongList = data.long.map((item) => (
        <ReminderItem
            key={item.id}
            data={item}
            onComplete={onComplete}
            completeButtonText={completeButtonText}
        />
    ));

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">リマインド対象一覧</h2>
            
            {/* A. 初めての薬 セクション */}
            <section className="mb-8">
                <h3 className="text-xl font-bold text-red-700 border-l-4 border-red-500 pl-3 mb-4 flex items-center">
                    💊 初めての薬
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({data.first.length}件)
                    </span>
                </h3>
                {data.first.length === 0 ? (
                    <p className="text-gray-400 text-sm">対象データはありません</p>
                ) : (
                    FirstList
                )}
            </section>

            {/* B. 長期の薬 セクション */}
            <section>
                <h3 className="text-xl font-bold text-cyan-700 border-l-4 border-cyan-500 pl-3 mb-4 flex items-center">
                    📅 長期の薬
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({data.long.length}件)
                    </span>
                </h3>
                {data.long.length === 0 ? (
                    <p className="text-gray-400 text-sm">対象データはありません</p>
                ) : (
                    LongList
                )}
            </section>
        </div>
    );
};