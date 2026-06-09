"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Prediction = {
  place: string;
  race_number: number;
  horse_count: number;
  prediction: number[] | null;
  is_locked?: boolean;
};

export default function PredictionPage() {
  const [date, setDate] = useState("");
  const [data, setData] = useState<Prediction[]>([]);
  const [places, setPlaces] = useState<string[]>([]); // 🔥 ① 追加
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  const [generated, setGenerated] = useState(false);

  // =========================
  // 🔥 ② 競馬場取得
  // =========================
  const fetchPlaces = async (targetDate: string) => {
    if (!targetDate) return;

    try {
      const res = await api.get("/admin/predictions/places", {
        params: { date: targetDate },
      });

      setPlaces(res.data.places);

    } catch (error) {
      console.error("競馬場取得エラー", error);
    }
  };

  // =========================
  // 🟢 検索
  // =========================
  const fetchData = async () => {
    if (!date) {
      alert("日付を選択してください");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/admin/predictions/", {
        params: { date },
      });

      setData(res.data);

      const isLocked = res.data.some((item: Prediction) => item.is_locked);
      setLocked(isLocked);

      setGenerated(isLocked);

    } catch (error) {
      console.error(error);
      alert("取得エラー");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔥 予想生成
  // =========================
  const generatePredictions = async () => {
    if (!date) {
      alert("日付を選択してください");
      return;
    }

    if (locked) {
      alert("この日はロック済みのため生成できません");
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/predictions/generate", null, {
        params: { date },
      });

      const res = await api.get("/admin/predictions/", {
        params: { date },
      });

      setData(res.data);
      setGenerated(true);

      const isLocked = res.data.some((item: Prediction) => item.is_locked);
      setLocked(isLocked);

    } catch (error) {
      console.error(error);
      alert("生成エラー");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔒 ロック
  // =========================
  const lockPredictions = async () => {
    if (!date) {
      alert("日付を選択してください");
      return;
    }

    if (!confirm("この予想を確定しますか？（変更できなくなります）")) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/predictions/lock", null, {
        params: { date },
      });

      alert("予想を確定しました");

      const res = await api.get("/admin/predictions/", {
        params: { date },
      });

      setData(res.data);

      const isLocked = res.data.some((item: Prediction) => item.is_locked);
      setLocked(isLocked);

      setGenerated(true);

    } catch (error) {
      console.error(error);
      alert("ロックエラー");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ⭐ 表示フォーマット
  // =========================
  const formatPrediction = (prediction: number[] | null) => {
    if (!prediction) return "-";
    return `◎${prediction[0]} ○${prediction[1]} ▲${prediction[2]}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        予想確認
      </h2>

      {/* ========================= */}
      {/* 日付＋ボタン */}
      {/* ========================= */}
      <div className="flex gap-4 mb-6 items-center">
        <input
          type="date"
          value={date}
          className="bg-gray-800 p-2"
          onChange={(e) => {
            const selectedDate = e.target.value;
            setDate(selectedDate);

            // 🔥 ③ 日付変更で競馬場取得
            fetchPlaces(selectedDate);
          }}
        />

        <button
          onClick={fetchData}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          検索
        </button>

        <button
          onClick={generatePredictions}
          disabled={locked}
          className={`px-4 py-2 rounded ${
            locked
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600"
          }`}
        >
          予想生成
        </button>

        <button
          onClick={lockPredictions}
          disabled={locked || data.length === 0}
          className={`px-4 py-2 rounded ${
            locked
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-600"
          }`}
        >
          予想確定
        </button>

        {locked && (
          <span className="text-red-400 font-bold">
            🔒 確定済み
          </span>
        )}
      </div>

      {/* ========================= */}
      {/* 🔥 ④ 競馬場一覧表示 */}
      {/* ========================= */}
      {places.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-bold">開催競馬場</h3>
          <div className="flex flex-wrap gap-2">
            {places.map((place) => (
              <div
                key={place}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                {place}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div>処理中...</div>}

      {!loading && data.length === 0 && date && (
        <div className="text-gray-400 mb-4">
          予想がまだ生成されていません
        </div>
      )}

      {/* ========================= */}
      {/* テーブル */}
      {/* ========================= */}
      {data.length > 0 && (
        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border">競馬場</th>
              <th className="p-2 border">R</th>
              <th className="p-2 border">頭数</th>
              <th className="p-2 border">予想</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={`${item.place}-${item.race_number}`}
                className="text-center"
              >
                <td className="p-2 border">{item.place}</td>
                <td className="p-2 border">{item.race_number}R</td>
                <td className="p-2 border">{item.horse_count}</td>

                <td className="p-2 border font-bold text-yellow-400">
                  {generated
                    ? formatPrediction(item.prediction)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}