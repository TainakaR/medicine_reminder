import React from "react";
import { ReminderItem } from "../components/ReminderItems";
import type { Reminder } from "../types";

type Props = {
    // App.tsxから渡されるデータ (既に100件に制限された完了済みのReminderリスト)
    data: Reminder[]; 
    // App.tsxから渡される完了処理関数
    onAction: (id: string) => void;
    // ボタンテキスト (App.tsxで指定)
    completeButtonText: string; 
};

export const CompletedPage: React.FC<Props> = ({
    data,
    onAction,
    completeButtonText,
}) => {

    const totalCount = data.length;

    if (totalCount === 0) {
        return (
            <div className="py-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">完了履歴</h2>
                <p className="text-gray-400">まだ完了したものがありません。</p>
            </div>
        );
    }

  // 完了済みのアイテムリスト
    const CompletedList = data.map((item) => (
        <ReminderItem
            key={item.id}
            data={item}
            onAction={onAction} 
            completeButtonText={completeButtonText} 
        />
    ));

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
                完了履歴 
                <span className="ml-2 text-sm font-normal text-gray-400">
                    (最新{totalCount}件を表示中)
                </span>
            </h2>

            {CompletedList}

            {/* 100件に満たない場合は、最大表示件数を注釈として表示 */}
            {totalCount === 100 && (
                <p className="mt-4 text-sm text-gray-500">
                    ※ 完了履歴は最新100件まで表示されます。
                </p>
            )}
        </div>
    );
};