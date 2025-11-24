// src/App.tsx (修正箇所のみ)

import { useState, useEffect } from "react";
import { initReminders } from "./initReminders";
import { ReminderItem } from "./components/ReminderItems";
import { groupReminders } from "./utils/reminderUtils";
import type { Reminder } from "./types";
import { RemindPage } from "./pages/RemindPage"; 
import { OverduePage } from "./pages/OverduePage";
import { CompletedPage } from "./pages/CompletedPage";
// CompletedPage はステージ1完了済みと仮定
import { RegisterPage } from "./pages/RegisterPage"; // ★RegisterPageをインポート

type TabType = "remind" | "overdue" | "completed";

function App() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const raw = localStorage.getItem("reminders");
      if (raw) return JSON.parse(raw) as Reminder[];
    } catch (err) {
      console.error("Failed to parse reminders from localStorage:", err);
    }
    return initReminders;
  });

  // remindersが更新されるたびにlocalStorageへ保存
  useEffect(() => {
    try {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    } catch (err) {
      console.error("Failed to save reminders to localStorage:", err);
    }
  }, [reminders]);
  const [activeTab, setActiveTab] = useState<TabType>("remind");
  // ★ステート名を変更し、モーダルの表示/非表示を制御
  const [showRegisterModal, setShowRegisterModal] = useState(false); 

  const grouped = groupReminders(reminders);

  const handleComplete = (id: string) => {
    // ... (既存のhandleCompleteロジック) ...
    setReminders((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, isDone: true };
        }
        return item;
      });
    });
  };
  
  // ★handleDeleteを定義 (ステージ1/2で必要)
  const handleDelete = (id: string) => {
    setReminders((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };
  
  // ★handleChangeを定義 (ステージ2/3で必要)
  const handleChange = (id: string) => {
    console.log(`ID: ${id} のデータを変更します。(未実装)`);
  };

  // ★新しいリマインダーを追加する関数
  const handleAddReminder = (newReminderData: Omit<Reminder, 'id' | 'createdAt' | 'isDone'>) => {
    const newReminder: Reminder = {
      id: Date.now().toString(), 
      createdAt: new Date().toISOString().split('T')[0], // 登録日を自動付与
      isDone: false, 
      ...newReminderData,
    };
    
    setReminders((prev) => [...prev, newReminder]);
  };
  
  // ... (getTabClass, overdueCount は省略) ...

  const getTabClass = (tabName: TabType) => {
    const baseClass = "px-4 py-2 font-bold rounded-t-lg transition-colors";
    const activeClass = "bg-teal-500 text-white shadow-md";
    const inactiveClass = "bg-gray-200 text-gray-600 hover:bg-gray-300";

    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  const overdueCount = grouped.overdue.first.length + grouped.overdue.long.length;


  const renderContent = () => {
    switch (activeTab) {
      case "remind":
        // RemindPageコンポーネントがステージ1で onAction/actionType に更新済みと仮定
        return (
          <RemindPage
            data={grouped.remind}
            onAction={handleComplete} 
            actionType={'COMPLETE'} 
            completeButtonText="完了"
          />
        );
      
      case "overdue":
        return (
          <OverduePage
            data={grouped.overdue}
            onAction={handleComplete}
            actionType={'COMPLETE'}
            completeButtonText="対応"
          />
        );
      
      case "completed":
        return (
          <CompletedPage
            data={grouped.completed}
            onAction={handleDelete}
            actionType={'DELETE'}
            completeButtonText="削除"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            薬剤師リマインド管理
          </h1>
          {/* ★新規登録ボタンをタブとは独立したヘッダー右側に配置 */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="py-2 px-4 rounded-full shadow-md text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-colors flex items-center gap-1"
          >
            <span className="text-xl leading-none">+</span> 新規登録
          </button>
        </header>

        {/* --- タブ切り替えエリア (変更なし) --- */}
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
        </div>

        {/* --- メインコンテンツエリア --- */}
        <div className="bg-white p-6 shadow-lg rounded-b-lg min-h-[400px]">
          {renderContent()}
        </div>
      </div>
      
      {/* ★モーダルをメインコンテンツの外側で描画 */}
      <RegisterPage
        isOpen={showRegisterModal}
        onAddReminder={handleAddReminder}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}

export default App;