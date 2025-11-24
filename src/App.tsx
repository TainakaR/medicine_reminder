// src/App.tsx (修正箇所のみ)

import { useState } from "react";
import { initReminders } from "./initReminders";
import { ReminderItem } from "./components/ReminderItems";
import { groupReminders } from "./utils/reminderUtils";
import type { Reminder } from "./types";
import { RemindPage } from "./pages/RemindPage"; 
// OverduePage, CompletedPage はステージ1完了済みと仮定
import { RegisterPage } from "./pages/RegisterPage"; // ★RegisterPageをインポート

type TabType = "remind" | "overdue" | "completed" | "future";

function App() {
  const [reminders, setReminders] = useState<Reminder[]>(initReminders);
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
        // OverduePageが未作成のため、App.tsxの既存ロジックを仮に配置
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">1週間経過</h2>
            <section className="mb-8">
                <h3 className="text-lg font-bold text-red-700 border-l-4 border-red-500 pl-3 mb-4">
                    🔥 初めての薬（期限超過）
                </h3>
                {grouped.overdue.first.length === 0 ? (
                    <p className="text-gray-400 text-sm">未対応のものはありません</p>
                ) : (
                    grouped.overdue.first.map((item) => (
                    <ReminderItem
                        key={item.id}
                        data={item}
                        onAction={handleComplete}
                        completeButtonText="対応"
                        actionType={'COMPLETE'}
                    />
                    ))
                )}
            </section>
            {grouped.overdue.first.length === 0 && grouped.overdue.long.length === 0 && (
              <p className="text-gray-400">現在、期限超過のリマインドはありません。</p>
            )}
          </div>
        );
      
      case "completed":
        // CompletedPageが未作成のため、App.tsxの既存ロジックを仮に配置
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">完了履歴</h2>
            {grouped.completed.map((item) => (
              <ReminderItem
                key={item.id}
                data={item}
                onAction={handleDelete} // 削除アクションを渡す
                completeButtonText="削除"
                actionType={'DELETE'}
              />
            ))}
            {grouped.completed.length === 0 && (
                <p className="text-gray-400">まだ完了したものがありません</p>
              )}
          </div>
        );

      case "future":
        // 登録一覧 (FuturePageが未作成のため、App.tsxの既存ロジックを仮に配置)
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">これからの予定</h2>
            {grouped.future.map((item) => (
              <ReminderItem
                key={item.id}
                data={item}
                onAction={handleChange} // 変更アクションを渡す
                completeButtonText="変更"
                actionType={'EDIT'}
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