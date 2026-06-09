"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Banner = {
  id: number;

  title: string;

  image_url: string;

  link: string;

  display_order?: number;
};

export default function BannerPage() {

  const [banners, setBanners] =
      useState<Banner[]>([]);

  const [siteName, setSiteName] =
      useState("");

  const [url, setUrl] =
      useState("");

  const [displayOrder, setDisplayOrder] =
      useState(0);

  const [image, setImage] =
      useState<File | null>(null);

  const [loading, setLoading] =
      useState(false);

  // =========================
  // 編集モード
  // =========================
  const [editingId, setEditingId] =
      useState<number | null>(null);

  // =========================
  // API BASE
  // =========================
  const BASE_URL =
      "http://192.168.11.7:8000";

  // =========================
  // 一覧取得
  // =========================
  const fetchBanners = async () => {

    try {

      const res = await api.get(
          "/admin/banners/"
      );

      setBanners(res.data);

    } catch (e) {

      console.error(e);

      alert("取得失敗");
    }
  };

  // =========================
  // 初回
  // =========================
  useEffect(() => {
    fetchBanners();
  }, []);

  // =========================
  // 入力初期化
  // =========================
  const resetForm = () => {

    setSiteName("");

    setUrl("");

    setDisplayOrder(0);

    setImage(null);

    setEditingId(null);

    const fileInput =
        document.getElementById(
            "banner-image"
        ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =========================
  // 新規登録
  // =========================
  const createBanner = async () => {

    if (!siteName) {
      alert("サイト名を入力してください");
      return;
    }

    if (!url) {
      alert("URLを入力してください");
      return;
    }

    if (!image) {
      alert("画像を選択してください");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
          "site_name",
          siteName
      );

      formData.append(
          "url",
          url
      );

      formData.append(
          "display_order",
          String(displayOrder)
      );

      formData.append(
          "image",
          image
      );

      await api.post(
          "/admin/banners/",
          formData,
          {
            headers: {
              "Content-Type":
                  "multipart/form-data",
            },
          }
      );

      alert("登録しました");

      resetForm();

      fetchBanners();

    } catch (e) {

      console.error(e);

      alert("登録失敗");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // 編集開始
  // =========================
  const startEdit = (
      banner: Banner
  ) => {

    setEditingId(banner.id);

    setSiteName(banner.title);

    setUrl(banner.link);

    setDisplayOrder(
        banner.display_order ?? 0
    );

    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // 更新
  // =========================
  const updateBanner = async () => {

    if (!editingId) return;

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
          "site_name",
          siteName
      );

      formData.append(
          "url",
          url
      );

      formData.append(
          "display_order",
          String(displayOrder)
      );

      // 画像選択時のみ
      if (image) {

        formData.append(
            "image",
            image
        );
      }

      await api.put(
          `/admin/banners/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type":
                  "multipart/form-data",
            },
          }
      );

      alert("更新しました");

      resetForm();

      fetchBanners();

    } catch (e) {

      console.error(e);

      alert("更新失敗");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // 削除
  // =========================
  const deleteBanner = async (
      id: number,
  ) => {

    if (!confirm("削除しますか？")) {
      return;
    }

    try {

      await api.delete(
          `/admin/banners/${id}`
      );

      alert("削除しました");

      fetchBanners();

    } catch (e) {

      console.error(e);

      alert("削除失敗");
    }
  };

  return (

      <div className="p-6 text-white">

        {/* タイトル */}
        <h1 className="text-3xl font-bold mb-6">
          バナー管理
        </h1>

        {/* 入力フォーム */}
        <div className="bg-gray-900 p-6 rounded-xl mb-8 border border-gray-700">

          <h2 className="text-xl font-bold mb-4">

            {editingId
                ? "バナー更新"
                : "新規登録"}

          </h2>

          <div className="grid gap-4">

            {/* サイト名 */}
            <input
                type="text"
                placeholder="サイト名"
                value={siteName}
                onChange={(e) =>
                    setSiteName(
                        e.target.value
                    )
                }
                className="bg-black border border-gray-700 p-3 rounded"
            />

            {/* URL */}
            <input
                type="text"
                placeholder="URL"
                value={url}
                onChange={(e) =>
                    setUrl(
                        e.target.value
                    )
                }
                className="bg-black border border-gray-700 p-3 rounded"
            />

            {/* 表示順 */}
            <input
                type="number"
                placeholder="表示順"
                value={displayOrder}
                onChange={(e) =>
                    setDisplayOrder(
                        Number(
                            e.target.value
                        )
                    )
                }
                className="bg-black border border-gray-700 p-3 rounded"
            />

            {/* 画像 */}
            <input
                id="banner-image"
                type="file"
                accept="image/*"
                onChange={(e) => {

                  if (
                      e.target.files &&
                      e.target.files[0]
                  ) {

                    setImage(
                        e.target.files[0]
                    );
                  }
                }}
                className="bg-black border border-gray-700 p-3 rounded"
            />

            {/* プレビュー */}
            {image && (

                <div>

                  <div className="mb-2 text-sm text-gray-400">
                    画像プレビュー
                  </div>

                  <img
                      src={URL.createObjectURL(
                          image
                      )}
                      alt="preview"
                      className="w-80 h-24 object-cover rounded border border-gray-700"
                  />
                </div>
            )}

            {/* ボタン群 */}
            <div className="flex gap-3">

              {/* 登録 or 更新 */}
              <button
                  onClick={
                    editingId
                        ? updateBanner
                        : createBanner
                  }
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded p-3 font-bold"
              >

                {loading
                    ? (
                        editingId
                            ? "更新中..."
                            : "登録中..."
                    )
                    : (
                        editingId
                            ? "更新する"
                            : "登録する"
                    )}

              </button>

              {/* キャンセル */}
              {editingId && (

                  <button
                      onClick={resetForm}
                      className="bg-gray-600 hover:bg-gray-700 px-6 rounded font-bold"
                  >
                    キャンセル
                  </button>
              )}

            </div>

          </div>
        </div>

        {/* 一覧 */}
        <div className="grid gap-4">

          {banners.map((banner) => (

              <div
                  key={banner.id}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-4"
              >

                {/* 画像 */}
                <img
                    src={
                      `${BASE_URL}${banner.image_url}`
                    }
                    alt={banner.title}
                    className="w-64 h-20 object-cover rounded"
                />

                {/* 情報 */}
                <div className="flex-1">

                  <div className="font-bold text-lg">
                    {banner.title}
                  </div>

                  <div className="text-sm text-gray-400 break-all mt-1">
                    {banner.link}
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    表示順:
                    {" "}
                    {banner.display_order ?? 0}
                  </div>

                </div>

                {/* ボタン */}
                <div className="flex gap-2">

                  {/* 編集 */}
                  <button
                      onClick={() =>
                          startEdit(
                              banner
                          )
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold"
                  >
                    編集
                  </button>

                  {/* 削除 */}
                  <button
                      onClick={() =>
                          deleteBanner(
                              banner.id
                          )
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold"
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