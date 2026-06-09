"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const API = "http://127.0.0.1:8000";

export default function BlogCreatePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    is_published: true,
    published_at: "",
    image: null as File | null,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFile = (e: any) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const create = async () => {
    if (!form.title) {
      toast.error("タイトル必須");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("is_published", String(form.is_published));
    fd.append("published_at", form.published_at);

    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      await axios.post(`${API}/admin/blogs`, fd);
      toast.success("作成しました");
      router.push("/blogs");
    } catch {
      toast.error("作成失敗");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>記事追加</h1>

      <div style={{ marginBottom: 10 }}>
        <label>公開状態</label><br />
        <input
          type="checkbox"
          name="is_published"
          checked={form.is_published}
          onChange={handleChange}
        /> 表示
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>公開日時</label><br />
        <input
          type="datetime-local"
          name="published_at"
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>タイトル</label><br />
        <input
          name="title"
          style={{ width: "100%" }}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>本文</label><br />
        <textarea
          name="content"
          rows={10}
          style={{ width: "100%" }}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>画像</label><br />
        <input type="file" onChange={handleFile} />
      </div>

      <button onClick={create}>
        作成
      </button>

    </div>
  );
}