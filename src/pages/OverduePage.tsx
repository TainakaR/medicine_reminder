import React from "react";
import { ReminderItem } from "../components/ReminderItems";
import type { Reminder } from "../types";

type OverdueData = {
    first: Reminder[];
    long: Reminder[];
};

type Props = {
    // App.tsxから渡されるデータ
    data: OverdueData; 
    // App.tsxから渡される完了処理関数
    onAction: (id: string) => void;
    // ボタンテキスト (App.tsxで指定)
    completeButtonText: string; 
};

export const OverduePage: React.FC<Props> = ({
    data,
    onAction,
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
            onAction={onAction}
            completeButtonText={completeButtonText}
        />
    ));

    // 2. 長期の薬 リスト
    const LongList = data.long.map((item) => (
        <ReminderItem
            key={item.id}
            data={item}
            onAction={onAction}
            completeButtonText={completeButtonText}
        />
    ));

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">リマインド対象一覧</h2>
            
            {/* A. 初めての薬 セクション */}
            <section className="mb-8">
                {FirstList}
            </section>

            {/* B. 長期の薬 セクション */}
            <section>
                {LongList}
            </section>
        </div>
    );
};