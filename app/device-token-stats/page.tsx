"use client";

import { useEffect, useState } from "react";

import axios from "axios";


// =========================
// 🔥 API
// =========================
const API =
  "https://api.keiba-ai-yosou.com";


// =========================
// 🔥 型定義
// =========================
type StatsRow = {

  date: string;

  ios: number;

  android: number;

  total: number;
};


export default function DeviceTokenStatsPage() {

  // =========================
  // 🔥 state
  // =========================
  const [startDate, setStartDate] =
    useState("2026-05-01T00:00:00");

  const [endDate, setEndDate] =
    useState("2026-05-31T23:59:59");

  const [unit, setUnit] =
    useState("daily");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [rows, setRows] =
    useState<StatsRow[]>([]);

  const [summary, setSummary] =
    useState({

      ios: 0,

      android: 0,

      total: 0,
    });

  // =========================
  // 🔥 初回ロード
  // =========================
  useEffect(() => {

    fetchStats();

  }, []);

  // =========================
  // 🔥 集計取得
  // =========================
  const fetchStats = async () => {

    try {

      setLoading(true);

      setError("");

      const res = await axios.get(

        `${API}/device-token/stats/summary`,

        {

          params: {

            start_date:
              startDate,

            end_date:
              endDate,

            unit,
          },
        }
      );

      // =========================
      // 🔥 rows
      // =========================
      setRows(
        res.data.rows || []
      );

      // =========================
      // 🔥 summary
      // =========================
      setSummary(

        res.data.summary || {

          ios: 0,

          android: 0,

          total: 0,
        }
      );

    } catch (e) {

      console.error(e);

      setError(
        "集計取得に失敗しました"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{

        padding: 30,

        backgroundColor:
          "#0f172a",

        minHeight: "100vh",

        color: "white",
      }}
    >

      {/* ========================= */}
      {/* 🔥 タイトル */}
      {/* ========================= */}
      <h1
        style={{

          fontSize: 32,

          fontWeight: "bold",

          marginBottom: 30,
        }}
      >
        登録数集計
      </h1>

      {/* ========================= */}
      {/* 🔥 条件エリア */}
      {/* ========================= */}
      <div
        style={{

          backgroundColor:
            "#111827",

          border:
            "1px solid #374151",

          borderRadius: 12,

          padding: 20,

          marginBottom: 30,
        }}
      >

        {/* ========================= */}
        {/* 🔥 日付 */}
        {/* ========================= */}
        <div
          style={{

            display: "flex",

            alignItems: "center",

            gap: 10,

            marginBottom: 20,

            flexWrap: "wrap",
          }}
        >

          <label>
            開始日時
          </label>

          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            style={{

              backgroundColor:
                "#1f2937",

              color: "white",

              border:
                "1px solid #4b5563",

              padding:
                "8px 12px",

              borderRadius: 6,
            }}
          />

          <span>〜</span>

          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            style={{

              backgroundColor:
                "#1f2937",

              color: "white",

              border:
                "1px solid #4b5563",

              padding:
                "8px 12px",

              borderRadius: 6,
            }}
          />

        </div>

        {/* ========================= */}
        {/* 🔥 集計単位 */}
        {/* ========================= */}
        <div
          style={{
            marginBottom: 20,
          }}
        >

          <div
            style={{
              marginBottom: 10,
            }}
          >
            集計単位
          </div>

          <label
            style={{
              marginRight: 20,
            }}
          >
            <input
              type="radio"
              checked={
                unit === "hourly"
              }
              onChange={() =>
                setUnit(
                  "hourly"
                )
              }
            />

            時間別
          </label>

          <label
            style={{
              marginRight: 20,
            }}
          >
            <input
              type="radio"
              checked={
                unit === "daily"
              }
              onChange={() =>
                setUnit(
                  "daily"
                )
              }
            />

            日別
          </label>

          <label>

            <input
              type="radio"
              checked={
                unit === "monthly"
              }
              onChange={() =>
                setUnit(
                  "monthly"
                )
              }
            />

            月別
          </label>

        </div>

        {/* ========================= */}
        {/* 🔥 ボタン */}
        {/* ========================= */}
        <button
          onClick={fetchStats}
          disabled={loading}
          style={{

            backgroundColor:
              "#2563eb",

            color: "white",

            border: "none",

            padding:
              "10px 20px",

            borderRadius: 8,

            cursor: "pointer",

            fontWeight: "bold",
          }}
        >

          {loading
            ? "集計中..."
            : "集計開始"}

        </button>

      </div>

      {/* ========================= */}
      {/* 🔥 エラー */}
      {/* ========================= */}
      {error && (

        <div
          style={{

            backgroundColor:
              "#7f1d1d",

            padding: 12,

            borderRadius: 8,

            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* ========================= */}
      {/* 🔥 summary */}
      {/* ========================= */}
      <div
        style={{

          display: "flex",

          gap: 20,

          marginBottom: 30,

          flexWrap: "wrap",
        }}
      >

        {/* iOS */}
        <div
          style={{

            backgroundColor:
              "#111827",

            border:
              "1px solid #374151",

            borderRadius: 12,

            padding: 20,

            minWidth: 180,
          }}
        >

          <div
            style={{
              color: "#9ca3af",
              marginBottom: 10,
            }}
          >
            iOS登録数
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            {summary.ios}
          </div>

        </div>

        {/* Android */}
        <div
          style={{

            backgroundColor:
              "#111827",

            border:
              "1px solid #374151",

            borderRadius: 12,

            padding: 20,

            minWidth: 180,
          }}
        >

          <div
            style={{
              color: "#9ca3af",
              marginBottom: 10,
            }}
          >
            Android登録数
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            {summary.android}
          </div>

        </div>

        {/* 合計 */}
        <div
          style={{

            backgroundColor:
              "#111827",

            border:
              "1px solid #374151",

            borderRadius: 12,

            padding: 20,

            minWidth: 180,
          }}
        >

          <div
            style={{
              color: "#9ca3af",
              marginBottom: 10,
            }}
          >
            合計登録数
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            {summary.total}
          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* 🔥 テーブル */}
      {/* ========================= */}
      <div
        style={{

          overflowX: "auto",

          backgroundColor:
            "#111827",

          border:
            "1px solid #374151",

          borderRadius: 12,
        }}
      >

        <table
          style={{

            width: "100%",

            borderCollapse:
              "collapse",
          }}
        >

          <thead>

            <tr
              style={{
                backgroundColor:
                  "#1f2937",
              }}
            >

              <th
                style={thStyle}
              >
                日時
              </th>

              <th
                style={thStyle}
              >
                iOS
              </th>

              <th
                style={thStyle}
              >
                Android
              </th>

              <th
                style={thStyle}
              >
                合計
              </th>

            </tr>

          </thead>

          <tbody>

            {rows.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  style={{

                    textAlign:
                      "center",

                    padding: 30,

                    color:
                      "#9ca3af",
                  }}
                >
                  データがありません
                </td>

              </tr>
            )}

            {rows.map(
              (
                row,
                index
              ) => (

                <tr
                  key={index}
                  style={{
                    borderTop:
                      "1px solid #374151",
                  }}
                >

                  <td
                    style={tdStyle}
                  >
                    {row.date}
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {row.ios}
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {row.android}
                  </td>

                  <td
                    style={tdStyle}
                  >
                    {row.total}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// =========================
// 🔥 style
// =========================
const thStyle = {

  padding: "14px",

  textAlign: "center" as const,

  fontWeight: "bold",

  borderBottom:
    "1px solid #374151",
};

const tdStyle = {

  padding: "14px",

  textAlign: "center" as const,
};