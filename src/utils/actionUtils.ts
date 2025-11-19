import type { ActionType, ActionConfig } from "../types"; 

export const getActionConfig = (type: ActionType): ActionConfig => {
    switch (type) {
        case 'COMPLETE':
            return {
                buttonText: '完了',
                modalActionLabel: '対処済み',
                buttonClass: "bg-teal-500 hover:bg-teal-600",
                confirmButtonClass: "bg-teal-500 hover:bg-teal-600",
            };
        case 'DELETE':
            return {
                buttonText: '削除',
                modalActionLabel: '完全に削除',
                buttonClass: "bg-red-500 hover:bg-red-600",
                confirmButtonClass: "bg-red-600 hover:bg-red-700",
            };
        case 'EDIT':
            return {
                buttonText: '変更',
                modalActionLabel: '変更',
                buttonClass: "bg-blue-500 hover:bg-blue-600",
                confirmButtonClass: "bg-blue-600 hover:bg-blue-700",
            };
        default:
            return getActionConfig('COMPLETE');
    }
};