# OpenClaw Hashline

讓 AI 幫你改檔案時，不再打錯字、改錯行、浪費 token。

---

## 為什麼你需要這個？

你用過 AI coding agent 改程式碼嗎？它常常這樣：

```
❌ 叫 AI 把第 42 行改了
→ AI 背錯那行的內容 → 編輯失敗
→ AI 再試一次 → 又失敗（空格不對、縮排不對）
→ AI 再試第三次 → 終於對了...但你已經等了好久，token 也燒光了

✅ 用 Hashline 之後：
→ AI 說「改第 42 行」→ 系統自動驗證那行沒被改過 → 直接修好
→ 一次就過。token 省 30-60%。
```

## Benchmark

用 OpenClaw 原始碼（`src/agents/*.ts`）10 個檔案、20 次長行編輯（40-200 字元的程式碼行）：

| 方法 | 成功率 | token 用量 | 省下 |
|------|--------|-----------|------|
| 傳統 `edit`（search_replace） | 100% | 3,961 | — |
| **Hashline**（行號編輯） | 100% | 2,129 | **-46.3%** |

為什麼省這麼多？傳統 `edit` 要求 AI 重複輸入整行舊內容才能定位編輯位置。Hashline 只需要行號 — 舊行內容完全不進 prompt。

省下的 token 可以讓 AI 多改幾行、多想幾步，同樣的 context window 做更多事。

## 安裝

```bash
npm install openclaw-hashline
```

然後在 `openclaw.json` 啟用：

```json
{
  "plugins": {
    "entries": {
      "hashline": { "enabled": true }
    }
  }
}
```

重啟 OpenClaw，搞定。

## 使用

讀檔後直接用行號編輯，不用背內容：

```
#FILE:src/app.ts
≔42 REPLACE const greeting = "你好";
»17
console.log("added after line 17");
≔99 DELETE
```

如果你能看到 hash（sub-agent、後續回合），也可以這樣：

```
≔42a3 REPLACE const greeting = "你好";
```

hash 不匹配 → 系統會拒絕編輯並告訴你哪幾行變了，不會改錯。

## 適用場景（誠實版）

**✅ 適合：**

- 修改既有檔案（debug、重構、加功能）— 這是 coding agent 最常做的事
- 跨多檔編輯 — 每個檔案重複用 hash，累積省下的 token 可觀
- Sub-agent / 多回合對話 — hashline 輸出會留在 transcript，後續回合自動受益

**❌ 不適合：**

- 建立全新檔案 — 這時候用 `write` 就好，hashline 幫不上忙
- 整份檔案重寫 — 如果你要砍掉重練，直接 `write` 新內容更快
- 需要大量上下文判斷的語意編輯 — hashline 只管「哪一行要改」，不管「為什麼要改」

## 運作原理（給好奇的人）

這不是魔術，就三個步驟：

1. **讀檔**：每行自動算一個 2 字元的身分證（xxHash32），附加在行號後面
2. **編輯**：AI 用行號指出要改哪幾行，系統檢查身分證是否匹配
3. **寫入**：確認無誤後，用原子寫入（temp → rename）確保不會寫一半當機

如果檔案在「讀取」跟「編輯」之間被其他程式改過 → 身分證對不上 → 拒絕修改，防止改錯。

## 安全性

- 所有編輯限制在 workspace 內（防路徑遍歷攻擊）
- 雙層路徑驗證
- Atomic write（防 partial write）
- 31 個自動化測試全過

## 授權

MIT

## 跟 oh-my-pi 的關係

Hashline 概念源自 [oh-my-pi](https://github.com/can1357/oh-my-pi)（MIT license），本專案將其移植為 OpenClaw plugin，讓 OpenClaw 生態系的使用者也能享受同樣的省 token 效果。oh-my-pi 的 benchmark 顯示 hash-anchored 模式在 Grok Code Fast 上讓編輯成功率從 6.7% 提升到 68.3%（10 倍），我們的實作保留了相同的核心演算法（xxHash32 + bigram 池）。
