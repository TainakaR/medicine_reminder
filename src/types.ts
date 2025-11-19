/*'first': 初めての薬 'long' : 長期の薬 */
export type Category = 'first' | 'long';

/* リマインドデータ */
export type Reminder = {
    id: string;
    p_ID: string;
    name: string;
    category: Category;
    targetDate: string;
    isDone: boolean;
    remarks?: string;
};