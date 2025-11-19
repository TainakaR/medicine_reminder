import React, { useState } from "react";
import type { Reminder } from "../types";
import { parseISO, differenceInCalendarDays } from "date-fns";
import { getActionConfig } from "../utils/actionUtils";
import type { ActionType } from "../types";

type Props = {
    data: Reminder;
    onAction: (id: string) => void;
    actionType: ActionType; 
    completeButtonText?: string;
};

export const ReminderItem: React.FC<Props> = ({ data, onAction, actionType, completeButtonText }) => {
    
    //ActionTypeに基づいて必要な設定情報を取得
    const actionConfig = getActionConfig(actionType);
    
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
    
    const colorStyles =
        data.category === "first"
            ? "bg-red-50 border-red-200 text-red-900"     // 'first'スタイル
            : "bg-cyan-50 border-cyan-200 text-cyan-900"; // 'long'スタイル
    const categoryLabel = data.category === "first" ? "初回" : "長期";
    const categoryBadgeColor =
        data.category === "first" ? "bg-red-500" : "bg-cyan-500";
    
    // App.tsxで指定されたボタン文字列を優先し、指定がなければActionUtilsのデフォルトを使用
    const buttonText = completeButtonText || actionConfig.buttonText;
    
    // モーダルの表示ラベルとボタンクラスはActionConfigから取得
    const { modalActionLabel, buttonClass, confirmButtonClass } = actionConfig;

    
    return (
        <>
            <div
                className={`border-2 rounded-lg p-4 mb-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4 ${colorStyles}`}
            >
                {/* --- 左側: 情報エリア --- */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`${categoryBadgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
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

                    <div className="text-sm mb-2">
                        <span className="font-semibold mr-2 text-gray-600">来局日:</span>
                        {data.createdAt}
                    </div>

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
                            // actionConfigから取得したクラスを使用
                            className={`${buttonClass} text-white font-bold py-2 px-6 rounded shadow transition-colors`}
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-all">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            確認
                        </h3>
                        <p className="text-gray-600 mb-6">
                            <span className="font-bold text-gray-800">{data.name}</span> さんのリマインドを「{modalActionLabel}」にしますか？
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleConfirm}
                                // actionConfigから取得したクラスを使用
                                className={`px-4 py-2 rounded ${confirmButtonClass} text-white font-bold shadow transition-colors`}
                            >
                                {actionType === 'EDIT' ? '変更' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};