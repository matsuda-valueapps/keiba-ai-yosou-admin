"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:8000";

type Blog = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at?: string;
  is_active: boolean;
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // ⭐ ① state追加（編集用）
  // =========================
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);

  // =========================
  // ⭐ 記事取得
  // =========================
  const fetchBlog = async () => {
    if (!id) return;

    try {
      const res = await axios.get(`${API}/blogs/${id}`);
      const data = res.data;

      setBlog(data);

      // =========================
      // ⭐ ② fetch後にセット
      // =========================
      setTitle(data.title || "");
      setContent(data.content || "");
      setIsActive(data.is_active ?? true);

    } catch (e) {
      console.error("記事取得失敗", e);
      toast.error("記事取得失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // =========================
  // ⭐ ④ 更新API
  // =========================
  const updateBlog = async () => {
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("is_published", String(isActive)); // ← FastAPI側と合わせる

      await axios.put(`${API}/admin/blogs/${id}`, formData);

      toast.success("更新しました");

      // 一覧に戻る
      router.push("/blogs");

    } catch (e) {
      console.error(e);
      toast.error("更新失敗");
    }
  };

  // =========================
  // ローディング
  // =========================
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!blog) {
    return <div style={{ padding: 20 }}>記事が見つかりません</div>;
  }

  // =========================
  // ⭐ ③ 入力フォームに変更
  // =========================
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>

      <h1 style={{ marginBottom: 20 }}>記事編集</h1>

      {/* タイトル */}
      <div style={{ marginBottom: 16 }}>
        <label>タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 6,
          }}
        />
      </div>

      {/* 本文 */}
      <div style={{ marginBottom: 16 }}>
        <label>本文（HTML可）</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 6,
          }}
        />
      </div>

      {/* 公開状態 */}
      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          公開する
        </label>
      </div>

      {/* 画像プレビュー */}
      {blog.image_url && (
        <img
          src={blog.image_url}
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "contain",
            marginBottom: 20,
          }}
        />
      )}

      {/* =========================
          ⭐ ⑤ ボタン
         ========================= */}
      <button
        onClick={updateBlog}
        style={{
          backgroundColor: "#22c55e",
          color: "white",
          padding: "10px 20px",
          borderRadius: 6,
        }}
      >
        更新する
      </button>
    </div>
  );
}