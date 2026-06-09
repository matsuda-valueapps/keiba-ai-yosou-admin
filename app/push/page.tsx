'use client'

import { useEffect, useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

interface PushNotification {
  id: number
  message: string
  link_type: string
  link_value?: string
  scheduled_at: string
  status: string
  sent_at?: string
  created_at: string
}

interface Blog {
  id: number
  title: string
}

export default function PushPage() {

  const [pushes, setPushes] = useState<PushNotification[]>([])

  const [blogs, setBlogs] = useState<Blog[]>([])

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState('')

  const [linkType, setLinkType] = useState('home')

  const [linkValue, setLinkValue] = useState('')

  const [scheduledAt, setScheduledAt] = useState('')


  // =========================
  // Push一覧取得
  // =========================
  const fetchPushes = async () => {

    try {

      const res = await fetch(
        `${API_BASE}/admin/push/`
      )

      const data = await res.json()

      setPushes(data)

    } catch (e) {

      console.error(e)
    }
  }


  // =========================
  // Blog一覧取得
  // =========================
  const fetchBlogs = async () => {

    try {

      const res = await fetch(
        `${API_BASE}/admin/blogs/`
      )

      const data = await res.json()

      setBlogs(data)

    } catch (e) {

      console.error(e)
    }
  }


  // =========================
  // 初期化
  // =========================
  useEffect(() => {

    fetchPushes()

    fetchBlogs()

  }, [])


  // =========================
  // Push登録
  // =========================
  const createPush = async () => {

    if (!message) {

      alert('本文を入力してください')

      return
    }

    if (!scheduledAt) {

      alert('送信日時を入力してください')

      return
    }

    setLoading(true)

    try {

      const res = await fetch(
        `${API_BASE}/admin/push/`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({

            message,

            link_type: linkType,

            link_value:
              linkType === 'blog'
                ? linkValue
                : null,

            scheduled_at: scheduledAt,
          }),
        }
      )

      if (!res.ok) {

        throw new Error(
          'Push作成失敗'
        )
      }

      alert(
        'Push通知を登録しました'
      )

      setMessage('')

      setLinkType('home')

      setLinkValue('')

      setScheduledAt('')

      fetchPushes()

    } catch (e) {

      console.error(e)

      alert(
        'Push通知作成エラー'
      )

    } finally {

      setLoading(false)
    }
  }


  // =========================
  // Push削除
  // =========================
  const deletePush = async (
    pushId: number
  ) => {

    const ok = confirm(
      '削除しますか？'
    )

    if (!ok) return

    try {

      await fetch(
        `${API_BASE}/admin/push/${pushId}`,
        {
          method: 'DELETE',
        }
      )

      fetchPushes()

    } catch (e) {

      console.error(e)

      alert('削除失敗')
    }
  }


  // =========================
  // 共通フォームCSS
  // =========================
  const inputClass =
    `
      w-full
      rounded-xl
      border
      border-gray-300
      bg-white
      px-4
      py-3
      text-black
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
    `


  // =========================
  // UI
  // =========================
  return (

    <div className='p-6 bg-black min-h-screen text-white'>

      <h1 className='text-4xl font-bold mb-10'>
        プッシュ通知管理
      </h1>


      {/* ========================= */}
      {/* 登録フォーム */}
      {/* ========================= */}

      <div
        className='
          bg-white
          rounded-3xl
          p-8
          mb-12
          shadow-xl
          border
          border-gray-200
        '
      >

        <h2
          className='
            text-2xl
            font-bold
            text-black
            mb-8
          '
        >
          Push通知登録
        </h2>


        {/* 送信日時 */}
        <div className='mb-6'>

          <label
            className='
              block
              mb-2
              text-sm
              font-bold
              text-gray-800
            '
          >
            送信日時
          </label>

          <input
            type='datetime-local'

            value={scheduledAt}

            onChange={(e) =>
              setScheduledAt(
                e.target.value
              )
            }

            className={inputClass}
          />
        </div>


        {/* 本文 */}
        <div className='mb-6'>

          <label
            className='
              block
              mb-2
              text-sm
              font-bold
              text-gray-800
            '
          >
            本文
          </label>

          <textarea
            value={message}

            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }

            className={`${inputClass} h-40 resize-none`}

            placeholder='Push通知本文を入力してください'

            maxLength={70}
          />

          <div
            className='
              text-right
              text-sm
              text-gray-500
              mt-2
            '
          >
            {message.length} / 70文字
          </div>
        </div>


        {/* リンク種別 */}
        <div className='mb-6'>

          <label
            className='
              block
              mb-2
              text-sm
              font-bold
              text-gray-800
            '
          >
            リンク種別
          </label>

          <select
            value={linkType}

            onChange={(e) =>
              setLinkType(
                e.target.value
              )
            }

            className={inputClass}
          >

            <option value='home'>
              ホームページ
            </option>

            <option value='blog'>
              ブログ記事
            </option>

            <option value='ranking'>
              ランキングページ
            </option>

            <option value='prediction'>
              予想ページ
            </option>

          </select>
        </div>


        {/* Blog選択 */}
        {linkType === 'blog' && (

          <div className='mb-6'>

            <label
              className='
                block
                mb-2
                text-sm
                font-bold
                text-gray-800
              '
            >
              ブログ記事選択
            </label>

            <select
              value={linkValue}

              onChange={(e) =>
                setLinkValue(
                  e.target.value
                )
              }

              className={inputClass}
            >

              <option value=''>
                選択してください
              </option>

              {blogs.map((blog) => (

                <option
                  key={blog.id}
                  value={blog.id}
                >
                  {blog.title}
                </option>

              ))}

            </select>
          </div>
        )}


        {/* 登録ボタン */}
        <button

          onClick={createPush}

          disabled={loading}

          className='
            bg-blue-600
            hover:bg-blue-700
            transition
            duration-200
            text-white
            font-bold
            px-8
            py-3
            rounded-xl
            shadow-md
            disabled:opacity-50
          '
        >
          {loading
            ? '送信中...'
            : 'Push登録'}
        </button>
      </div>


      {/* ========================= */}
      {/* Push一覧 */}
      {/* ========================= */}

      <div>

        <h2 className='text-3xl font-bold mb-6'>
          Push一覧
        </h2>

        <div
          className='
            overflow-x-auto
            rounded-2xl
            border
            border-gray-700
            shadow-lg
          '
        >

          <table
            className='
              w-full
              border-collapse
              bg-white
              text-black
            '
          >

            <thead>

              <tr className='bg-gray-100'>

                <th className='border p-4'>
                  ID
                </th>

                <th className='border p-4'>
                  本文
                </th>

                <th className='border p-4'>
                  リンク
                </th>

                <th className='border p-4'>
                  送信日時
                </th>

                <th className='border p-4'>
                  状態
                </th>

                <th className='border p-4'>
                  操作
                </th>

              </tr>

            </thead>


            <tbody>

              {pushes.map((push) => (

                <tr
                  key={push.id}
                  className='hover:bg-gray-50'
                >

                  <td className='border p-4'>
                    {push.id}
                  </td>

                  <td className='border p-4'>
                    {push.message}
                  </td>

                  <td className='border p-4'>
                    {push.link_type}
                  </td>

                  <td className='border p-4'>
                    {push.scheduled_at}
                  </td>

                  <td className='border p-4'>

                    {push.status === 'pending' && (

                      <span
                        className='
                          text-yellow-600
                          font-bold
                        '
                      >
                        送信待ち
                      </span>
                    )}

                    {push.status === 'sent' && (

                      <span
                        className='
                          text-green-600
                          font-bold
                        '
                      >
                        送信済み
                      </span>
                    )}

                    {push.status === 'failed' && (

                      <span
                        className='
                          text-red-600
                          font-bold
                        '
                      >
                        失敗
                      </span>
                    )}

                  </td>

                  <td className='border p-4'>

                    <button
                      onClick={() =>
                        deletePush(push.id)
                      }

                      className='
                        bg-red-500
                        hover:bg-red-600
                        transition
                        duration-200
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        font-bold
                      '
                    >
                      削除
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  )
}