"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

const API = "https://api.keiba-ai-yosou.com";

export default function RankingsPage() {

  // =========================
  // ランキング一覧
  // =========================
  const [rankings, setRankings] =
    useState<any[]>([]);

  // =========================
  // サイト一覧
  // =========================
  const [sites, setSites] =
    useState<any[]>([]);

  // =========================
  // 🔥 ブログ一覧
  // =========================
  const [blogs, setBlogs] =
    useState<any[]>([]);

  // =========================
  // amount / hit_count
  // =========================
  const [type, setType] =
    useState("amount");

  // =========================
  // フォーム
  // =========================
  const [form, setForm] = useState({

    site_id: "",

    blog_id: "",

    race_name: "",

    date: "",

    amount: "",

    hit_count: "",
  });

  // =========================
  // 初期取得
  // =========================
  useEffect(() => {

    fetchRankings();

    fetchSites();

    fetchBlogs();

  }, [type]);

  // =========================
  // ランキング取得
  // =========================
  const fetchRankings = async () => {

    try {

      const res = await axios.get(
        `${API}/rankings?ranking_type=${type}`
      );

      setRankings(res.data);

    } catch (error) {

      console.error(error);

      toast.error(
        "ランキング取得失敗"
      );
    }
  };

  // =========================
  // サイト取得
  // =========================
  const fetchSites = async () => {

    try {

      const res = await axios.get(
        `${API}/admin/rankings/sites`
      );

      setSites(res.data);

    } catch (error) {

      console.error(error);

      toast.error(
        "サイト取得失敗"
      );
    }
  };

  // =========================
  // ブログ取得
  // =========================
  const fetchBlogs = async () => {

    try {

      const res = await axios.get(
        `${API}/admin/rankings/blogs`
      );

      setBlogs(res.data);

    } catch (error) {

      console.error(error);

      toast.error(
        "ブログ取得失敗"
      );
    }
  };

  // =========================
  // フォーム変更
  // =========================
  const handleChange = (
    e: any
  ) => {

    const { name, value } = e.target;

    setForm({

      ...form,

      [name]:

        name === "site_id" ||
        name === "blog_id"

          ? value === ""
            ? ""
            : Number(value)

          : value,
    });
  };

  // =========================
  // updateField
  // =========================
  const updateField = (

    index: number,

    key: string,

    value: any

  ) => {

    const newList = [...rankings];

    newList[index] = {

      ...newList[index],

      [key]:

        key === "amount" ||
        key === "hit_count" ||
        key === "site_id" ||
        key === "blog_id" ||
        key === "rank"

          ? value === ""
            ? ""
            : Number(value)

          : value,
    };

    setRankings(newList);
  };

  // =========================
  // バリデーション
  // =========================
  const validate = () => {

    if (!form.site_id) {

      toast.error(
        "サイトを選択してください"
      );

      return false;
    }

    // =========================
    // amountランキング
    // =========================
    if (type === "amount") {

      if (!form.date) {

        toast.error(
          "日付を入力してください"
        );

        return false;
      }

      if (!form.race_name) {

        toast.error(
          "レース名を入力してください"
        );

        return false;
      }

      if (
        !form.amount ||
        Number(form.amount) <= 0
      ) {

        toast.error(
          "金額は1以上で入力してください"
        );

        return false;
      }
    }

    // =========================
    // hit_countランキング
    // =========================
    if (type === "hit_count") {

      if (
        !form.hit_count ||
        Number(form.hit_count) <= 0
      ) {

        toast.error(
          "的中数は1以上で入力してください"
        );

        return false;
      }
    }

    return true;
  };

  // =========================
  // 作成
  // =========================
  const create = async () => {

    if (!validate()) {
      return;
    }

    try {

      // =========================
      // 🔥 payload作成
      // =========================
      const payload = {

        site_id:
          Number(form.site_id),

        // =========================
        // 🔥 blog_id空→null
        // =========================
        blog_id:

          form.blog_id === ""
            ? null
            : Number(form.blog_id),

        // =========================
        // 🔥 amount用
        // =========================
        race_name:

          type === "amount"
            ? form.race_name
            : "",

        date:

          type === "amount"
            ? form.date
            : "",

        amount:

          type === "amount"
            ? Number(form.amount)
            : null,

        // =========================
        // 🔥 hit_count用
        // =========================
        hit_count:

          type === "hit_count"
            ? Number(form.hit_count)
            : null,

        ranking_type:
          type,

        // =========================
        // 🔥 rank追加
        // FastAPI側422対策
        // =========================
        rank: 0,
      };

      console.log(
        "POST PAYLOAD:",
        payload
      );

      await axios.post(

        `${API}/admin/rankings/`,

        payload
      );

      toast.success(
        "追加しました"
      );

      fetchRankings();

      setForm({

        site_id: "",

        blog_id: "",

        race_name: "",

        date: "",

        amount: "",

        hit_count: "",
      });

    } catch (error: any) {

      console.error(error);

      // =========================
      // 🔥 FastAPIエラー確認
      // =========================
      console.log(
        "422 DETAIL:",
        error?.response?.data
      );

      toast.error(
        "追加に失敗しました"
      );
    }
  };

  // =========================
  // 更新
  // =========================
  const update = async (
    index: number
  ) => {

    const item = rankings[index];

    if (!item.site_id) {

      toast.error(
        "サイトが未選択です"
      );

      return;
    }

    // =========================
    // 金額ランキング
    // =========================
    if (
      type === "amount" &&
      (!item.amount ||
        item.amount <= 0)
    ) {

      toast.error(
        "金額が不正です"
      );

      return;
    }

    // =========================
    // 的中数ランキング
    // =========================
    if (
      type === "hit_count" &&
      (!item.hit_count ||
        item.hit_count <= 0)
    ) {

      toast.error(
        "的中数が不正です"
      );

      return;
    }

    try {

      // =========================
      // 🔥 PUT payload
      // =========================
      const payload = {

        ...item,

        blog_id:

          item.blog_id === ""
            ? null
            : item.blog_id,

        amount:

          type === "amount"
            ? Number(item.amount)
            : null,

        hit_count:

          type === "hit_count"
            ? Number(item.hit_count)
            : null,

        // =========================
        // 🔥 rank保証
        // =========================
        rank:
          Number(item.rank || 0),
      };

      console.log(
        "PUT PAYLOAD:",
        payload
      );

      await axios.put(

        `${API}/admin/rankings/${item.id}`,

        payload
      );

      toast.success(
        "更新しました"
      );

      fetchRankings();

    } catch (error: any) {

      console.error(error);

      console.log(
        "422 DETAIL:",
        error?.response?.data
      );

      toast.error(
        "更新に失敗しました"
      );
    }
  };

  // =========================
  // 削除
  // =========================
  const remove = async (
    id: number
  ) => {

    try {

      await axios.delete(
        `${API}/admin/rankings/${id}`
      );

      toast.success(
        "削除しました"
      );

      fetchRankings();

    } catch (error) {

      console.error(error);

      toast.error(
        "削除に失敗しました"
      );
    }
  };

  return (

    <div
      style={{
        padding: 20,
        color: "white",
      }}
    >

      <h1>ランキング管理</h1>

      {/* タブ */}
      <div
        style={{
          marginBottom: 20,
        }}
      >

        <button

          onClick={() =>
            setType("amount")
          }

          style={{

            backgroundColor:
              type === "amount"
                ? "#3b82f6"
                : "#222",

            padding: "8px 16px",

            borderRadius: 6,

            marginRight: 10,
          }}
        >
          獲得金額
        </button>

        <button

          onClick={() =>
            setType("hit_count")
          }

          style={{

            backgroundColor:
              type === "hit_count"
                ? "#22c55e"
                : "#222",

            padding: "8px 16px",

            borderRadius: 6,
          }}
        >
          的中数
        </button>

      </div>

      {/* ========================= */}
      {/* 新規追加 */}
      {/* ========================= */}
      <div
        style={{

          marginBottom: 30,

          border: "1px solid #333",

          padding: 10,
        }}
      >

        <h3>新規追加</h3>

        <div
          style={{

            display: "flex",

            alignItems: "center",

            gap: 10,

            flexWrap: "wrap",
          }}
        >

          {/* サイト */}
          <select

            name="site_id"

            value={form.site_id}

            onChange={handleChange}
          >

            <option value="">
              サイト選択
            </option>

            {sites.map((s: any) => (

              <option
                key={s.id}
                value={s.id}
              >
                {s.name}
              </option>

            ))}

          </select>

          {/* ブログ */}
          <select

            name="blog_id"

            value={form.blog_id}

            onChange={handleChange}
          >

            <option value="">
              ブログなし
            </option>

            {blogs.map((b: any) => (

              <option
                key={b.id}
                value={b.id}
              >
                {b.title}
              </option>

            ))}

          </select>

          {/* amount */}
          {type === "amount" && (
            <>

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />

              <input
                name="race_name"
                placeholder="レース名"
                value={form.race_name}
                onChange={handleChange}
              />

              <input
                name="amount"
                type="number"
                placeholder="金額"
                value={form.amount}
                onChange={handleChange}
              />

            </>
          )}

          {/* hit_count */}
          {type === "hit_count" && (

            <input
              name="hit_count"
              type="number"
              placeholder="的中数"
              value={form.hit_count}
              onChange={handleChange}
            />

          )}

          <button onClick={create}>
            追加
          </button>

        </div>

      </div>

      {/* ========================= */}
      {/* 一覧 */}
      {/* ========================= */}
      <table
        style={{
          width: "100%",
          textAlign: "center",
          borderCollapse:
            "collapse",
        }}
        border={1}
        cellPadding={10}
      >

        <thead>

          <tr>

            <th>順位</th>

            {type === "amount" && (
              <th>日付</th>
            )}

            {type === "amount" && (
              <th>レース</th>
            )}

            <th>
              {type === "amount"
                ? "金額"
                : "的中数"}
            </th>

            <th>サイト</th>

            <th>ブログ</th>

            <th>操作</th>

          </tr>

        </thead>

        <tbody>

          {rankings.map(
            (
              r: any,
              index: number
            ) => (

              <tr key={r.id}>

                {/* 順位 */}
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign:
                      "middle",
                  }}
                >
                  {r.rank}
                </td>

                {/* 日付 */}
                {type === "amount" && (

                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign:
                        "middle",
                    }}
                  >

                    {/* 🔥 date input中央揃え */}
                    <input

                      type="text"

                      value={
                        r.date
                          ? r.date.replaceAll("-", "/")
                          : ""
                      }

                      style={{

                        textAlign:
                          "center",

                        width: "100%",

                        background: "transparent",

                        border: "none",

                        color: "white",

                        outline: "none",
                      }}

                      onChange={(e) =>

                        updateField(

                          index,

                          "date",

                          e.target.value.replaceAll("/", "-")
                        )
                      }
                    />

                  </td>
                )}

                {/* レース */}
                {type === "amount" && (

                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign:
                        "middle",
                    }}
                  >

                    <input

                      value={
                        r.race_name || ""
                      }

                      style={{

                        textAlign:
                          "center",

                        width: "100%",
                      }}

                      onChange={(e) =>
                        updateField(
                          index,
                          "race_name",
                          e.target.value
                        )
                      }
                    />

                  </td>
                )}

                {/* 金額 / 的中数 */}
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign:
                      "middle",
                  }}
                >

                  <input

                    type="number"

                    value={
                      type === "amount"
                        ? (r.amount ?? "")
                        : (r.hit_count ?? "")
                    }

                    style={{

                      textAlign:
                        "center",

                      width: "100%",
                    }}

                    onChange={(e) =>
                      updateField(

                        index,

                        type === "amount"
                          ? "amount"
                          : "hit_count",

                        e.target.value
                      )
                    }
                  />

                </td>

                {/* サイト */}
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign:
                      "middle",
                  }}
                >

                  <select

                    value={
                      r.site_id ?? ""
                    }

                    style={{
                      textAlign:
                        "center",
                    }}

                    onChange={(e) =>
                      updateField(
                        index,
                        "site_id",
                        e.target.value
                      )
                    }
                  >

                    {sites.map((s: any) => (

                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.name}
                      </option>

                    ))}

                  </select>

                </td>

                {/* ブログ */}
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign:
                      "middle",
                  }}
                >

                  <select

                    value={
                      r.blog_id ?? ""
                    }

                    style={{

                      textAlign:
                        "center",

                      width: "100%",
                    }}

                    onChange={(e) =>
                      updateField(
                        index,
                        "blog_id",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      ブログなし
                    </option>

                    {blogs.map((b: any) => (

                      <option
                        key={b.id}
                        value={b.id}
                      >
                        {b.title}
                      </option>

                    ))}

                  </select>

                </td>

                {/* 操作 */}
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign:
                      "middle",
                    whiteSpace:
                      "nowrap",
                  }}
                >

                  <button

                    onClick={() =>
                      update(index)
                    }

                    style={{

                      backgroundColor:
                        "#facc15",

                      marginRight: 6,

                      padding: "6px 10px",

                      borderRadius: 4,
                    }}
                  >
                    更新
                  </button>

                  <button

                    onClick={() =>
                      remove(r.id)
                    }

                    style={{

                      backgroundColor:
                        "#ef4444",

                      color: "white",

                      padding: "6px 10px",

                      borderRadius: 4,
                    }}
                  >
                    削除
                  </button>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}