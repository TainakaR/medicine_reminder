// src/App.tsx

import { useState } from "react";
import { initReminders } from "./initReminders";
import { ReminderItem } from "./components/ReminderItems";
import { groupReminders } from "./utils/reminderUtils";
import type { Reminder } from "./types";
import { RemindPage } from "./pages/RemindPage"; 
import { OverduePage } from "./pages/OverduePage";
import { CompletedPage } from "./pages/CompletedPage";

type TabType = "remind" | "overdue" | "completed" | "future";

function App() {
  const [reminders, setReminders] = useState<Reminder[]>(initReminders);
  const [activeTab, setActiveTab] = useState<TabType>("remind");

  const grouped = groupReminders(reminders);

  // 完了処理
  const handleComplete = (id: string) => {
    setReminders((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, isDone: true };
        }
        return item;
      });
    });
  };
  
  // 削除処理
  const handleDelete = (id: string) => {
    setReminders((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };

  // データ変更処理 (未実装)
  const handleChange = (id: string) => {
    console.log(`ID: ${id} のデータを変更します。(未実装)`);
  };

  const getTabClass = (tabName: TabType) => {
    const baseClass = "px-4 py-2 font-bold rounded-t-lg transition-colors";
    const activeClass = "bg-teal-500 text-white shadow-md";
    const inactiveClass = "bg-gray-200 text-gray-600 hover:bg-gray-300";

    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  const overdueCount = grouped.overdue.first.length + grouped.overdue.long.length;

  // ★レンダリングするコンポーネントを決定するロジックを定義
  const renderContent = () => {
    switch (activeTab) {
      case "remind":
        // RemindPageコンポーネントを呼び出す
        return (
          <RemindPage
            data={grouped.remind}
            onAction={handleComplete}
            completeButtonText="完了" // ボタンテキストを指定
          />
        );
      
      case "overdue":
        // RemindPageコンポーネントを呼び出す
        return (
          <OverduePage
            data={grouped.overdue}
            onAction={handleComplete}
            completeButtonText="完了" // ボタンテキストを指定
          />
        );
      
      case "completed":
        return (
          <CompletedPage
            data={grouped.completed}
            onAction={handleDelete}
            completeButtonText="削除" // ボタンテキストを指定
          />
        );

      case "future":
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">これからの予定</h2>
            {grouped.future.map((item) => (
              <ReminderItem
                key={item.id}
                data={item}
                onAction={handleComplete}
                completeButtonText="確認" // ボタンテキストを指定 (ここでは仮に「確認」)
              />
            ))}
            {grouped.future.length === 0 && (
                <p className="text-gray-400">予定はありません</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            薬剤師リマインド管理
          </h1>
        </header>

        {/* --- タブ切り替えエリア --- */}
        <div className="flex gap-2 mb-0 border-b-4 border-teal-500">
          <button
            onClick={() => setActiveTab("remind")}
            className={getTabClass("remind")}
          >
            リマインド
            <span className="ml-2 bg-white text-teal-600 text-xs px-2 py-0.5 rounded-full">
              {grouped.remind.first.length + grouped.remind.long.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("overdue")}
            className={getTabClass("overdue")}
          >
            1週間経過
            {overdueCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {overdueCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={getTabClass("completed")}
          >
            対処済み
          </button>
          <button
            onClick={() => setActiveTab("future")}
            className={getTabClass("future")}
          >
            登録一覧
          </button>
        </div>

        {/* --- メインコンテンツエリア --- */}
        <div className="bg-white p-6 shadow-lg rounded-b-lg min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;