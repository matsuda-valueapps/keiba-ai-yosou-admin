"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

type Review = {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export default function ReviewsPage() {
  const params = useParams();

  const siteId =
    typeof params.siteId === "string"
      ? Number(params.siteId)
      : Number(params.siteId?.[0]);

  if (!siteId || isNaN(siteId)) {
    return <div className="p-6 text-white">SiteIDエラー</div>;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const baseUrl = "http://192.168.11.7:8000";

  // =========================
  // JST表示
  // =========================
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // GET
  // =========================
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/admin/reviews?site_id=${siteId}`
      );
      setReviews(res.data);
    } catch (err: any) {
      console.error("GET ERROR:", err.response?.data || err.message);
      alert("取得エラー");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [siteId]);

  // =========================
  // POST（🔥 修正）
  // =========================
  const createReview = async () => {
    if (!userName || !comment || !createdAt) {
      alert("全て入力してください");
      return;
    }

    try {
      await axios.post(`${baseUrl}/admin/reviews`, {
        site_id: siteId,
        user_name: userName,
        rating,
        comment,
        created_at: createdAt, // 🔥 そのまま送る
      });

      setUserName("");
      setRating(5);
      setComment("");
      setCreatedAt("");

      fetchReviews();
    } catch (err: any) {
      console.error("POST ERROR:", err.response?.data || err.message);
      alert("登録エラー");
    }
  };

  // =========================
  // PUT
  // =========================
  const updateReview = async (r: Review) => {
    try {
      await axios.put(`${baseUrl}/admin/reviews/${r.id}`, {
        user_name: r.user_name,
        rating: r.rating,
        comment: r.comment,
      });

      fetchReviews();
    } catch (err: any) {
      console.error("PUT ERROR:", err.response?.data || err.message);
      alert("更新エラー");
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteReview = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    try {
      await axios.delete(`${baseUrl}/admin/reviews/${id}`);
      fetchReviews();
    } catch (err: any) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      alert("削除エラー");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        クチコミ管理（SiteID: {siteId}）
      </h1>

      {/* 新規追加 */}
      <div className="bg-[#1a1a1a] p-4 rounded mb-6">
        <div className="flex gap-3 mb-3">

          <input
            type="datetime-local"
            className="bg-black p-2 rounded"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />

          <input
            placeholder="投稿名"
            className="bg-black p-2 rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <select
            className="bg-black p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}★</option>
            ))}
          </select>

          <button
            onClick={createReview}
            className="bg-blue-600 px-4 rounded"
          >
            新規追加
          </button>
        </div>

        <textarea
          placeholder="クチコミ内容"
          className="w-full bg-black p-3 rounded"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* 一覧 */}
      <div className="space-y-2">

        <div className="grid grid-cols-6 bg-gray-800 p-2 text-center text-sm">
          <div>ID</div>
          <div>公開日時</div>
          <div>投稿名</div>
          <div>評価</div>
          <div>内容</div>
          <div>操作</div>
        </div>

        {reviews.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-6 items-center bg-[#1a1a1a] p-2 border border-gray-700 text-sm"
          >
            <div>{r.id}</div>

            <div>{formatDate(r.created_at)}</div>

            <input
              className="bg-black p-1"
              value={r.user_name}
              onChange={(e) => {
                r.user_name = e.target.value;
                setReviews([...reviews]);
              }}
            />

            <select
              className="bg-black p-1"
              value={r.rating}
              onChange={(e) => {
                r.rating = Number(e.target.value);
                setReviews([...reviews]);
              }}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}★</option>
              ))}
            </select>

            <textarea
              className="bg-black p-1"
              value={r.comment}
              onChange={(e) => {
                r.comment = e.target.value;
                setReviews([...reviews]);
              }}
            />

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => updateReview(r)}
                className="bg-yellow-500 px-2 py-1 rounded"
              >
                更新
              </button>

              <button
                onClick={() => deleteReview(r.id)}
                className="bg-red-600 px-2 py-1 rounded"
              >
                削除
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}