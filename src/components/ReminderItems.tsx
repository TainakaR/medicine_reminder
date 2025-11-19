import React, { useState } from "react";
import type { Reminder } from "../types";
import { parseISO, differenceInCalendarDays } from "date-fns";

type Props = {
    data: Reminder;
    onAction: (id: string) => void;
    completeButtonText?: string;
};

export const ReminderItem: React.FC<Props> = ({ data, onAction, completeButtonText }) => {
    // 完了ボタンのハンドラー
    const [showModal, setShowModal] = useState(false);
    /* 完了確認モーダルの表示 */
    const handleClickComplete = () => {
        setShowModal(true);
    }
    /* 「はい」が押されたときの処理 */
    const handleConfirm = () => {
        onAction(data.id);
        setShowModal(false);
    }
    /* 「キャンセル」が押されたときの処理 */
    const handleCancel = () => {
        setShowModal(false);
    }

    const getDurationLabel = () => {
        // 文字列の日付をDate型に変換して差分を計算
        const start = parseISO(data.createdAt);
        const end = parseISO(data.targetDate);
        const diffDays = differenceInCalendarDays(end, start);

        if (diffDays === 0) return "当日";
        if (diffDays === 7) return "1週間後";
        if (diffDays >= 28 && diffDays <= 31) return "1ヶ月後"; // おおよその判定
            return `${diffDays}日後`;
    };

    const durationLabel = getDurationLabel();
    

    // first: 赤系, long: 水色系
    const colorStyles =
        data.category === "first"
            ? "bg-red-50 border-red-200 text-red-900"     // 'first'スタイル
            : "bg-cyan-50 border-cyan-200 text-cyan-900"; // 'long'スタイル

    // 薬の属性ラベル（firstなら赤、longなら水色）
    const categoryLabel = data.category === "first" ? "初回" : "長期";
    const categoryBadgeColor =
        data.category === "first" ? "bg-red-500" : "bg-cyan-500";

    const buttonText = completeButtonText || '完了';
    const isDeleteAction = buttonText === '削除';
    const isEditAction = buttonText === '変更';

    const modalActionLabel = isDeleteAction ? '完全に削除' : isEditAction ? '変更' : '対処済み';

    const confirmButtonClass = isDeleteAction
        ? "bg-red-600 hover:bg-red-700" 
        : isEditAction
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-teal-500 hover:bg-teal-600";

    const buttonClass = isDeleteAction
        ? "bg-red-500 hover:bg-red-600"
        : isEditAction
        ? "bg-blue-500 hover:bg-blue-600"
        : "bg-teal-500 hover:bg-teal-600";
    
    return (
        <>
            <div
                className={`border-2 rounded-lg p-4 mb-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4 ${colorStyles}`}
            >
                {/* --- 左側: 情報エリア --- */}
                    <div className="flex-1">
                    {/* ヘッダー: 属性ラベル + ID + 氏名 */}
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className={`${categoryBadgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}
                        >
                            {categoryLabel}
                        </span>
                        <span className="bg-white/80 text-gray-600 text-xs font-bold px-2 py-1 rounded border border-gray-300">
                            {durationLabel}
                        </span>
                        <span className="text-gray-500 text-sm font-mono">
                            ID: {data.p_ID}
                        </span>
                        <span className="text-lg font-bold text-gray-800">{data.name}</span>
                    </div>

                    {/* 来局日 */}
                    <div className="text-sm mb-2">
                        <span className="font-semibold mr-2 text-gray-600">来局日:</span>
                        {data.createdAt}
                    </div>

                    {/* 備考 (ある場合のみ表示) */}
                    {data.remarks && (
                        <div className="mt-2 p-2 bg-white/60 rounded text-sm text-gray-700 border border-gray-200/50">
                            <span className="font-bold text-xs text-gray-500 block mb-1">
                                備考
                            </span>
                            {data.remarks}
                        </div>
                    )}
                </div>

                {/* --- 右側: アクションエリア --- */}
                <div className="flex flex-col justify-center items-end min-w-[100px]">
                    {!data.isDone && (
                        <button
                            onClick={handleClickComplete}
                            className={`${buttonClass} text-white font-bold py-2 px-6 rounded shadow transition-colors`}
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>

            {showModal && (
            // 1. 背景の黒い半透明レイヤー (fixedで画面全体を覆う)
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-all">
                    {/* 2. モーダル本体の白い箱 */}
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">

                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            確認
                        </h3>
                        <p className="text-gray-600 mb-6">
                            <span className="font-bold text-gray-800">{data.name}</span> さんのリマインドを「{modalActionLabel}」にしますか？
                        </p>

                        {/* ボタンエリア */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 rounded ${confirmButtonClass} text-white font-bold shadow transition-colors`}
                            >
                                {isEditAction ? '変更' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};