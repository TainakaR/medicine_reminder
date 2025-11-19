import type { Reminder } from "../types";
import { parseISO, isBefore, isAfter, startOfDay, subDays, isSameDay } from "date-fns";

/* データをページごとに分類　*/
type GroupedReminders = {
    remind: {
        first: Reminder[]; // 'first'カテゴリー
        long: Reminder[];  // 'long'カテゴリー
    };                     // ① リマインド (7日前〜今日)
    overdue: {
        first: Reminder[];
        long: Reminder[];   
    };                     // ② 1週間経過 (8日以上前)
    completed: Reminder[]; // ③ 対処済み
    future: Reminder[];    // ④ 登録一覧 (明日以降)
};

export const groupReminders = (reminders: Reminder[]): GroupedReminders => {
    const today = startOfDay(new Date());               // 00:00に設定する
    const sevenDaysAgo = startOfDay(subDays(today, 7)); // 7日前の00:00に設定する
    /* 空の配列を用意 */
    const groups: GroupedReminders = {
        remind: { first: [], long: [], },
        overdue: { first: [], long: [] },
        completed: [],
        future: [],
    };

    reminders.forEach((item) => {
        const targetDate = parseISO(item.targetDate);

        if (item.isDone) {
            groups.completed.push(item); // ③ 対処済み
            return;
        }

        if (isAfter(targetDate, today)) {
            groups.future.push(item); // ④ 登録一覧

        } else if (isBefore(targetDate, sevenDaysAgo)) {
            if (item.category === 'first') {
                groups.overdue.first.push(item); // ② 1週間経過 'first'
            } else {
                groups.overdue.long.push(item);  // ② 1週間経過 'long'
            }
            
        } else {
            if (item.category === 'first') {
                groups.remind.first.push(item);  // ① リマインド 'first'
            } else {
                groups.remind.long.push(item);   // ① リマインド 'long'
            }
        }
    });

    /* 各グループを新しい順にソート */
    const byTargetDateAsc = (a: Reminder, b: Reminder) => 
        a.targetDate.localeCompare(b.targetDate);         // リマインド日、昇順
    const byTargetDateDesc = (a: Reminder, b: Reminder) => 
        b.targetDate.localeCompare(a.targetDate);         // リマインド日、降順
    const byCreatedAtDesc = (a: Reminder, b: Reminder) => 
        b.createdAt.localeCompare(a.createdAt);           // 来局日、降順

    groups.remind.first.sort(byTargetDateAsc);  // ①リマインド、first
    groups.remind.long.sort(byTargetDateAsc);   // ①リマインド、long
    groups.overdue.first.sort(byTargetDateAsc); // ②1週間経過
    groups.overdue.long.sort(byTargetDateAsc);  // ②1週間経過
    groups.completed.sort(byTargetDateDesc);    // ③対処済み
    groups.completed = groups.completed.slice(0, 100);  // ③対処済みは最新100件のみ
    groups.future.sort(byCreatedAtDesc);        // ④登録日

    return groups;
}
