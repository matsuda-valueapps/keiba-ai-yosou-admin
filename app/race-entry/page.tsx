"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Entry = {
  id: number;
  race_number: number;
  horse_count: number;
  place: string;
};

export default function RaceEntryPage() {
  const [date, setDate] = useState("");
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // 一覧取得
  // =========================
  const fetchData = async () => {
    console.log("検索date:", date);

    if (!date) {
      alert("日付を選択してください");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/admin/race-entry/", {
        params: { date },
      });

      // ✅ 超安全版（null対策）
      setData(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error(error);
      alert("取得エラー");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 個別削除
  // =========================
  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    try {
      await api.delete(`/admin/race-entry/${id}`);
      await fetchData(); // ← 安定化
    } catch (error) {
      console.error(error);
      alert("削除エラー");
    }
  };

  // =========================
  // 全削除
  // =========================
  const handleDeleteAll = async () => {
    console.log("削除date:", date);

    if (!date) {
      alert("日付を選択してください");
      return;
    }

    if (!confirm("この日のデータを全て削除しますか？")) return;

    try {
      await api.delete("/admin/race-entry/all", {
        params: { date },
      });

      alert("全削除しました");

      await fetchData(); // ← 安定化

    } catch (error) {
      console.error(error);
      alert("全削除エラー");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        出走頭数 一覧
      </h2>

      {/* 日付 */}
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={date}
          className="bg-gray-800 p-2"
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={fetchData}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          検索
        </button>

        <button
          onClick={handleDeleteAll}
          className="bg-red-700 px-4 py-2 rounded"
        >
          この日の全削除
        </button>
      </div>

      {/* ローディング */}
      {loading && <div>読み込み中...</div>}

      {/* テーブル */}
      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 border">競馬場</th>
            <th className="p-2 border">R</th>
            <th className="p-2 border">頭数</th>
            <th className="p-2 border">操作</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">
                {item.place}
              </td>
              <td className="p-2 border">
                {item.race_number}R
              </td>
              <td className="p-2 border">
                {item.horse_count}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}