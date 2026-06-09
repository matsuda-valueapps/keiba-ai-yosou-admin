"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

type Site = {
  id: number;
  name: string;
  url: string;
  description?: string;
  image_url?: string;
};

export default function SitePage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [tab, setTab] = useState<"list" | "create">("list");

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // 一覧取得
  // =========================
  const fetchSites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/sites");
      setSites(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      alert("取得エラー");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // =========================
  // 新規 or 更新
  // =========================
  const handleSubmit = async () => {
    if (!name || !url) {
      alert("スポンサー名・URLを入力してください");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("url", url);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        await api.put(`/admin/sites/${editId}`, formData); // 🔥 headers削除
        alert("更新しました");
      } else {
        await api.post("/admin/sites", formData); // 🔥 headers削除
        alert("登録成功");
      }

      // リセット
      setName("");
      setUrl("");
      setDescription("");
      setImage(null);
      setEditId(null);

      setTab("list");
      await fetchSites(); // 🔥 await追加で確実に反映

    } catch (error) {
      console.error(error);
      alert("保存エラー");
    }
  };

  // =========================
  // 編集
  // =========================
  const handleEdit = (site: Site) => {
    setName(site.name);
    setUrl(site.url);
    setDescription(site.description || "");
    setEditId(site.id);
    setTab("create");
  };

  // =========================
  // 削除
  // =========================
  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    try {
      await api.delete(`/admin/sites/${id}`);
      await fetchSites(); // 🔥 await追加
    } catch (error) {
      console.error(error);
      alert("削除エラー");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        スポンサー管理
      </h2>

      {/* タブ */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("list")}
          className={`px-4 py-2 rounded ${
            tab === "list" ? "bg-gray-700" : "bg-gray-900"
          }`}
        >
          一覧
        </button>

        <button
          onClick={() => {
            setTab("create");
            setEditId(null);
          }}
          className={`px-4 py-2 rounded ${
            tab === "create" ? "bg-gray-700" : "bg-gray-900"
          }`}
        >
          新規追加
        </button>
      </div>

      {/* 一覧 */}
      {tab === "list" && (
        <>
          {loading && <div>読み込み中...</div>}

          <table className="w-full border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">画像</th>
                <th className="p-2 border">サイト名</th>
                <th className="p-2 border">URL</th>
                <th className="p-2 border w-[180px]">操作</th>
              </tr>
            </thead>

            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className="text-center">
                  <td className="p-2 border">{site.id}</td>

                  <td className="p-2 border">
                    {site.image_url ? (
                      <img
                        src={`http://127.0.0.1:8000${site.image_url}`}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    ) : (
                      "なし"
                    )}
                  </td>

                  <td className="p-2 border">
                    <Link href={`/sites/${site.id}/reviews`}>
                      <span className="text-blue-400 hover:underline cursor-pointer">
                        {site.name}
                      </span>
                    </Link>
                  </td>

                  <td className="p-2 border">{site.url}</td>

                  <td className="p-2 border">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(site)}
                        className="bg-yellow-500 px-3 py-1 rounded"
                      >
                        編集
                      </button>

                      <button
                        onClick={() => handleDelete(site.id)}
                        className="bg-red-600 px-3 py-1 rounded"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* 新規 / 編集 */}
      {tab === "create" && (
        <div className="bg-gray-900 p-6 rounded w-[500px]">

          <div className="mb-4 text-lg font-bold">
            {editId ? "スポンサー編集" : "スポンサー追加"}
          </div>

          <div className="mb-4">
            <div className="mb-1">名前</div>
            <input
              className="w-full bg-black p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="mb-1">URL</div>
            <input
              className="w-full bg-black p-2"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="mb-1">説明</div>
            <textarea
              className="w-full bg-black p-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="mb-1">サムネ画像</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            {editId ? "更新" : "追加"}
          </button>
        </div>
      )}
    </div>
  );
}