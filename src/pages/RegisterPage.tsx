// src/pages/RegisterPage.tsx

import React, { useState } from "react";
import type { Reminder } from "../types";

// App.tsx から新しいリマインダーを追加するための関数を受け取る
type Props = {
    onAddReminder: (newReminder: Omit<Reminder, 'id' | 'createdAt' | 'isDone'>) => void;
    // ★重要: 登録画面を表示・非表示するための制御関数を受け取る
    onClose: () => void; 
    isOpen: boolean;
};

// フォームの初期状態を定義
const initialFormData = {
    p_ID: '',
    name: '',
    category: 'first' as 'first' | 'long', // 初期値は'first'
    targetDate: '', // Date入力フィールドの初期値は空
    remarks: '',
};

export const RegisterPage: React.FC<Props> = ({ onAddReminder, onClose, isOpen }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // フォーム入力の変更ハンドラ
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // IDのバリデーション（7桁の数字のみ許可）
        if (name === 'p_ID') {
            // 数字以外の文字を削除
            const numericValue = value.replace(/[^0-9]/g, ''); 
            if (numericValue.length > 7) return; // 7桁以上は入力不可
            setFormData({ ...formData, [name]: numericValue });
            // 入力中にエラーをクリア
            if (errors.p_ID) setErrors({ ...errors, p_ID: '' });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    // ラジオボタンの変更ハンドラ
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, category: e.target.value as 'first' | 'long' });
    };

    // フォーム送信ハンドラ
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 簡易バリデーションチェック
        const newErrors: { [key: string]: string } = {};
        if (formData.p_ID.length !== 7) {
            newErrors.p_ID = 'IDは数字7桁で入力してください。';
        }
        if (!formData.name.trim()) {
            newErrors.name = '名前は必須です。';
        }
        if (!formData.targetDate) {
            newErrors.targetDate = 'リマインド日は必須です。';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 必要なデータのみを親コンポーネントに渡す
        // id, createdAt, isDone は親側(App.tsx)で付与される
        onAddReminder({
            p_ID: formData.p_ID,
            name: formData.name,
            category: formData.category,
            targetDate: formData.targetDate,
            remarks: formData.remarks.trim() || undefined,
        });
    
        // 登録後、フォームをリセットして画面を閉じる
        setFormData(initialFormData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            
            {/* モーダル本体 (白い箱) */}
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        
                {/* ヘッダーと閉じるボタン */}
                <div className="sticky top-0 bg-white p-6 border-b z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        新規リマインダー登録
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* ID (p_ID) */}
                    <div>
                        <label htmlFor="p_ID" className="block text-sm font-medium text-gray-700">
                            ID (数字7桁) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel" // telタイプでスマホでの数字入力を促す
                            id="p_ID"
                            name="p_ID"
                            value={formData.p_ID}
                            onChange={handleChange}
                            maxLength={7}
                            className={`mt-1 block w-full border ${errors.p_ID ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500`}
                            placeholder="例: 1234567"
                        />
                        {errors.p_ID && <p className="mt-1 text-sm text-red-500">{errors.p_ID}</p>}
                    </div>

                    {/* 名前 (name) */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* 初期or長期 (category) */}
                    <div>
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                            初期 or 長期 <span className="text-red-500">*</span>
                        </span>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    value="first"
                                    checked={formData.category === 'first'}
                                    onChange={handleCategoryChange}
                                    className="form-radio text-red-500 h-4 w-4"
                                />
                                <span className="ml-2 text-gray-700">初期 (初めての薬)</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    value="long"
                                    checked={formData.category === 'long'}
                                    onChange={handleCategoryChange}
                                    className="form-radio text-cyan-500 h-4 w-4"
                                />
                                <span className="ml-2 text-gray-700">長期 (既存の薬)</span>
                            </label>
                        </div>
                    </div>

                    {/* リマインド日 (targetDate) */}
                    <div>
                        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                            リマインド日 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="targetDate"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full border ${errors.targetDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.targetDate && <p className="mt-1 text-sm text-red-500">{errors.targetDate}</p>}
                    </div>

                    {/* 備考 (remarks) */}
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                            備考
                        </label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            rows={3}
                            value={formData.remarks}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="任意でメモを入力"
                        />
                    </div>

                    {/* 登録ボタン */}
                    <div className="pt-4 border-t mt-6">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-semibold bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                        >
                            リマインダーを登録
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};