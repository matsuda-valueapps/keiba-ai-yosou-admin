"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

const API = "https://api.keiba-ai-yosou.com";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/blogs`);
      setBlogs(res.data);
    } catch {
      toast.error("記事取得失敗");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    try {
      await axios.delete(`${API}/admin/blogs/${id}`);
      toast.success("削除しました");
      fetchBlogs();
    } catch {
      toast.error("削除失敗");
    }
  };

  // =========================
  // ⭐ 日付フォーマット（強化版）
  // =========================
  const formatDate = (date?: string) => {
    if (!date) return "-";

    const d = new Date(date);

    // JSTで表示（超重要）
    return d.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
  };

  // =========================
  // ⭐ 公開日時ロジック（重要）
  // =========================
  const getDisplayDate = (b: any) => {
    return formatDate(b.published_at || b.created_at);
  };

  return (
    <div style={{ padding: 20, color: "white" }}>

      <h1 style={{ marginBottom: 20 }}>記事一覧</h1>

      <Link href="/blogs/create">
        <button
          style={{
            marginBottom: 20,
            backgroundColor: "#3b82f6",
            padding: "8px 16px",
            borderRadius: 6,
          }}
        >
          ＋ 新規追加
        </button>
      </Link>

      {/* ローディング */}
      {loading && <p>読み込み中...</p>}

      {/* 空データ */}
      {!loading && blogs.length === 0 && (
        <p>記事がまだありません</p>
      )}

      {!loading && blogs.length > 0 && (
        <table style={{ width: "100%" }} border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>ID</th>
              <th>公開</th>
              <th>公開日時</th>
              <th>タイトル</th>
              <th>画像</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((b) => (
              <tr key={b.id}>
                <td style={{ textAlign: "center" }}>{b.id}</td>

                {/* 公開状態 */}
                <td style={{ textAlign: "center" }}>
                  {b.is_active ? "表示" : "非表示"}
                </td>

                {/* ⭐ここ修正 */}
                <td style={{ textAlign: "center" }}>
                  {getDisplayDate(b)}
                </td>

                <td>{b.title}</td>

                <td style={{ textAlign: "center" }}>
                  {b.image_url ? (
                    <img
                      src={b.image_url}
                      style={{ width: 60, borderRadius: 6 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td style={{ textAlign: "center" }}>
                  <Link href={`/blogs/${b.id}`}>
                    <button
                      style={{
                        marginRight: 6,
                        backgroundColor: "#facc15",
                        padding: "6px 10px",
                        borderRadius: 4,
                      }}
                    >
                      編集
                    </button>
                  </Link>

                  <button
                    onClick={() => remove(b.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: 4,
                    }}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}