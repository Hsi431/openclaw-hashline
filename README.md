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
→ 一次就過。本 repo 的可重跑 benchmark 中，edit payload 約省 36.6%。
```

## Benchmark

本 repo 內建可重跑 benchmark：

```bash
npm run benchmark
```

設計：

- 樣本：本 repo 內 6 個程式/測試/設定檔
- 任務：20 次單行 replace，目標行長 40-200 字元
- 比較：傳統 `search_replace` 需要帶 `old_string`；Hashline 只帶行號 + 2 字元 hash
- 指標：只量 edit tool-call payload，不包含完整模型上下文；approx tokens = `ceil(chars / 4)`，不是模型供應商的計費 tokenizer

2026-05-25 本機執行結果：

| 方法 | 成功率 | payload chars | approx tokens | 省下 |
|------|--------|---------------|---------------|------|
| 傳統 `search_replace`（精確舊行） | 20/20 | 4,549 | 約 1,138 | — |
| **Hashline**（行號 + hash） | 20/20 | 2,884 | 約 721 | **-36.6%** |

為什麼省這麼多？傳統 `edit` 要求 AI 重複輸入整行舊內容才能定位編輯位置。Hashline 只需要行號 + 2 字元 hash — 舊行內容完全不進 prompt。

省下的 token 可以讓 AI 多改幾行、多想幾步，同樣的 context window 做更多事。

同一個 benchmark 也測 stale 情境：

| stale 情境 | 結果 |
|------------|------|
| Hashline 帶 hash | 20/20 拒絕 stale edit |
| Hashline `unsafe_line_only` | 20/20 會覆蓋 stale 行 |
| 傳統 `search_replace` 精確舊行 | 20/20 因舊內容不匹配而拒絕 |

這表示 Hashline 的主要收益不是本地檔案寫入速度，而是「較短的 edit payload」和「不用重打舊行也能驗證 stale」。本地 apply time 會受 atomic write / fsync 影響，不適合拿來當模型工作效率指標。

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

讀檔後，下一輪 transcript 會留下可直接使用的 hashline 區塊：

```
#FILE:src/app.ts
42ab|const greeting = "hello";
43cd|console.log(greeting);
```

用 `hashline_edit` 時保留 `#FILE:`，再用行號 + 2 字元 hash 錨定修改：

```
#FILE:src/app.ts
≔42ab REPLACE const greeting = "你好";
»43cd
console.log("added after line 43");
≔43cd DELETE
```

也支援範圍取代：

```
#FILE:src/app.ts
≔10aa..15bb
// replacement block
```

hash 不匹配 → 系統會拒絕編輯並告訴你哪幾行變了，不會改錯。

如果你只有行號、沒有 hash，可以顯式設定 `unsafe_line_only: true` 使用 hashless 模式；這會繞過 stale-line protection，預設不允許。

## 適用場景

**✅ 適合：**

- 修改既有檔案 — 這是 coding agent 最常做的事
- 跨多檔工作 — 每次 `hashline_edit` 修改一個 `#FILE`，多檔案可分次套用，累積省下的 token 可觀
- Sub-agent / 多回合對話 — hashline 輸出會留在 transcript，後續回合自動受益

**❌ 不適合：**

- 建立全新檔案 — 這時候用 `write` 就好，hashline 幫不上忙
- 整份檔案重寫 — 如果你要砍掉重練，直接 `write` 新內容更快
- 需要大量上下文判斷的語意編輯 — hashline 只管「哪一行要改」，不管「為什麼要改」

## 運作原理

這不是魔術，就三個步驟：

1. **讀檔**：每行自動算一個 2 字元的身分證，附加在行號後面
2. **編輯**：AI 用行號指出要改哪幾行，系統檢查身分證是否匹配
3. **寫入**：確認無誤後，用原子寫入確保不會寫一半當機

如果檔案在「讀取」跟「編輯」之間被其他程式改過 → 身分證對不上 → 拒絕修改，防止改錯。

## 安全性

- 所有編輯限制在 OpenClaw 提供的 workspace 內
- lexical path + realpath 雙層驗證，阻擋 `..` 與 symlink directory escape
- Hash anchors 預設必填，避免行號 stale 後靜默改錯
- Atomic write（唯一暫存檔 + rename，防 partial write）
- `npm test` 覆蓋 parser、stale hash、hashless unsafe、symlink escape、range validation、read hook

## 授權

MIT

## 跟 oh-my-pi 的關係

Hashline 概念源自 [oh-my-pi](https://github.com/can1357/oh-my-pi)（MIT license），本專案將其移植為 OpenClaw plugin，讓 OpenClaw 生態系的使用者也能享受同樣的省 token 效果。oh-my-pi 的 benchmark 顯示 hash-anchored 模式在 Grok Code Fast 上讓編輯成功率從 6.7% 提升到 68.3%（10 倍），我們的實作保留了相同的核心演算法（xxHash32 + bigram 池）。
