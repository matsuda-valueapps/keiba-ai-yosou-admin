import "./globals.css";

import Link from "next/link";

import { Toaster } from "react-hot-toast";


// =========================
// 🔥 Menu定義
// =========================
const menuItems = [

  {
    href: "/device-token-stats",
    label: "📊 集計",
  },

  {
    href: "/sites",
    label: "🏇 スポンサー管理",
  },

  {
    href: "/blogs",
    label: "📝 記事",
  },

  {
    href: "/rankings",
    label: "🏆 ランキング",
  },

  {
    href: "/banners",
    label: "📢 バナー",
  },

  {
    href: "/push",
    label: "🔔 プッシュ通知",
  },
];


// =========================
// 🔥 予想管理Menu
// =========================
const predictionMenuItems = [

  {
    href: "/race-entry/bulk",
    label: "🏇 出走登録",
  },

  {
    href: "/race-entry",
    label: "📋 出走一覧",
  },

  {
    href: "/predictions",
    label: "🤖 予想確認",
  },

  {
    href: "/settings",
    label: "⚙️ 設定",
  },
];


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="ja">

      <body className="bg-black text-white">

        <div className="flex min-h-screen">

          {/* ========================= */}
          {/* 🔥 Sidebar */}
          {/* ========================= */}
          <aside
            className="
              w-64
              bg-[#0f172a]
              border-r
              border-gray-800
              flex
              flex-col
              shrink-0
            "
          >

            {/* ========================= */}
            {/* 🔥 Logo */}
            {/* ========================= */}
            <div
              className="
                p-5
                border-b
                border-gray-800
              "
            >

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-wide
                "
              >
                競馬AI予想 Admin
              </h1>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                Management System
              </p>

            </div>

            {/* ========================= */}
            {/* 🔥 Navigation */}
            {/* ========================= */}
            <nav
              className="
                flex-1
                p-4
                overflow-y-auto
              "
            >

              {/* ========================= */}
              {/* 🔥 Main Menu */}
              {/* ========================= */}
              <div className="space-y-2">

                {menuItems.map((item) => (

                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      flex
                      items-center
                      rounded-lg
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-200
                      hover:bg-[#1e293b]
                      hover:text-blue-400
                      hover:translate-x-1
                    "
                  >
                    {item.label}
                  </Link>

                ))}

              </div>

              {/* ========================= */}
              {/* 🔥 Divider */}
              {/* ========================= */}
              <div
                className="
                  my-6
                  border-t
                  border-gray-800
                "
              />

              {/* ========================= */}
              {/* 🔥 Prediction Menu */}
              {/* ========================= */}
              <div>

                <div
                  className="
                    px-4
                    mb-3
                    text-xs
                    font-bold
                    tracking-widest
                    text-gray-500
                  "
                >
                  予想管理
                </div>

                <div className="space-y-2">

                  {predictionMenuItems.map(
                    (item) => (

                      <Link
                        key={item.href}
                        href={item.href}
                        className="
                          flex
                          items-center
                          rounded-lg
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-white
                          transition-all
                          duration-200
                          hover:bg-[#1e293b]
                          hover:text-blue-400
                          hover:translate-x-1
                        "
                      >
                        {item.label}
                      </Link>
                    )
                  )}

                </div>

              </div>

            </nav>

          </aside>

          {/* ========================= */}
          {/* 🔥 Main Area */}
          {/* ========================= */}
          <div
            className="
              flex-1
              flex
              flex-col
              min-w-0
            "
          >

            {/* ========================= */}
            {/* 🔥 Header */}
            {/* ========================= */}
            <header
              className="
                h-16
                bg-[#1e293b]
                border-b
                border-gray-800
                flex
                items-center
                justify-between
                px-6
                shrink-0
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                  "
                >
                  管理画面
                </h2>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-blue-500
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                >
                  U
                </div>

                <div
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  ユーザー
                </div>

              </div>

            </header>

            {/* ========================= */}
            {/* 🔥 Page Content */}
            {/* ========================= */}
            <main
              className="
                flex-1
                overflow-auto
                p-6
                bg-black
              "
            >
              {children}
            </main>

          </div>

        </div>

        {/* ========================= */}
        {/* 🔥 Toast */}
        {/* ========================= */}
        <Toaster

          position="top-right"

          toastOptions={{

            duration: 1800,

            style: {

              background: "#1e293b",

              color: "#ffffff",

              borderRadius: "10px",

              padding: "12px 16px",

              fontSize: "14px",

              border:
                "1px solid rgba(255,255,255,0.1)",
            },

            success: {

              iconTheme: {

                primary: "#22c55e",

                secondary: "#ffffff",
              },
            },

            error: {

              iconTheme: {

                primary: "#ef4444",

                secondary: "#ffffff",
              },
            },
          }}
        />

      </body>

    </html>
  );
}