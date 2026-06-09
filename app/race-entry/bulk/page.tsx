"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const raceCourses = [
  "札幌",
  "函館",
  "福島",
  "新潟",
  "中山",
  "東京",
  "中京",
  "京都",
  "阪神",
  "小倉",
];

export default function RaceEntryBulkPage() {
  const [date, setDate] = useState("");

  // 競馬場（3つ）
  const [courses, setCourses] = useState(["", "", ""]);

  // 各ブロック12レース
  const [entries, setEntries] = useState(
    Array.from({ length: 3 }, () =>
      Array.from({ length: 12 }, (_, i) => ({
        race_number: i + 1,
        horse_count: 0,
      }))
    )
  );

  const handleChange = (
    blockIndex: number,
    raceIndex: number,
    value: number
  ) => {
    const newEntries = [...entries];
    newEntries[blockIndex][raceIndex].horse_count = value;
    setEntries(newEntries);
  };

  const handleCourseChange = (index: number, value: string) => {
    const newCourses = [...courses];
    newCourses[index] = value;
    setCourses(newCourses);
  };

  const handleSubmit = async () => {
    try {
      // ✅ 日付チェック
      if (!date) {
        alert("日付を選択してください");
        return;
      }

      // ✅ フラット化（未選択ブロック除外）
      const payload = entries.flatMap((block, blockIndex) => {
        if (!courses[blockIndex]) return [];

        return block.map((race) => ({
          race_number: race.race_number + blockIndex * 12,
          horse_count: race.horse_count,
          place: courses[blockIndex], // ← 修正済み
        }));
      });

      // ✅ 競馬場チェック
      if (payload.length === 0) {
        alert("競馬場を選択してください");
        return;
      }

      // 🔥 ここが最重要（配列で送信）
      await api.post(
        "/admin/race-entry/bulk",
        payload.map((item) => ({
          date: date,
          place: item.place,
          race_number: item.race_number,
          horse_count: item.horse_count,
        }))
      );

      alert("登録成功");
    } catch (error) {
      console.error(error);
      alert("エラー発生");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        出走頭数 一括登録
      </h2>

      {/* 日付 */}
      <input
        type="date"
        className="bg-gray-800 p-2 mb-6"
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 3ブロック */}
      {entries.map((block, blockIndex) => (
        <div key={blockIndex} className="mb-10">

          {/* 競馬場選択 */}
          <select
            className="bg-gray-800 p-2 mb-4"
            value={courses[blockIndex]}
            onChange={(e) =>
              handleCourseChange(blockIndex, e.target.value)
            }
          >
            <option value="">競馬場を選択</option>
            {raceCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* レース入力 */}
          <div className="grid grid-cols-4 gap-4">
            {block.map((entry, raceIndex) => (
              <div
                key={raceIndex}
                className="bg-gray-900 p-3 rounded"
              >
                <div>{entry.race_number}R</div>
                <input
                  type="number"
                  className="w-full bg-black p-1 mt-1"
                  value={entry.horse_count}
                  onChange={(e) =>
                    handleChange(
                      blockIndex,
                      raceIndex,
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 保存ボタン */}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 px-4 py-2 rounded"
      >
        保存
      </button>
    </div>
  );
}