/*'first': 初めての薬 'long' : 長期の薬 */
export type Category = 'first' | 'long';

/* リマインドデータ */
export type Reminder = {
    id: string;
    p_ID: string;
    name: string;
    category: Category;
    createdAt: string;
    targetDate: string;
    isDone: boolean;
    remarks?: string;
};

/* ボタンの種類の定義 */
export type ActionType = 'COMPLETE' | 'DELETE' | 'EDIT';

/* ボタンアクション設定の定義 */
export type ActionConfig = {
    buttonText: string;
    modalActionLabel: string;
    buttonClass: string;
    confirmButtonClass: string;
};