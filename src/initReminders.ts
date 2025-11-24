import type { Reminder } from "./types";
import { v4 as uuid } from "uuid";

export const initReminders: Reminder[] = [
    {
        id: uuid(),
        p_ID: "0123456",
        name: "田中太郎",
        category: "first",
        createdAt: "2025-11-08",
        targetDate: "2025-11-15",
        isDone: false,
    },
    {
        id: uuid(),
        p_ID: "9876543",
        name: "佐藤 花子",
        category: "long",
        createdAt: "2025-10-17",
        targetDate: "2025-11-17",
        isDone: true,
        remarks: "眠気が強いとのこと。様子確認。",
    },
    {
        id: uuid(),
        p_ID: "0012345",
        name: "鈴木 一郎",
        category: "long",
        createdAt: "2024-11-15",
        targetDate: "2024-11-18",
        isDone: false,
    },
]