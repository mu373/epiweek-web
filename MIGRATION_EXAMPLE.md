# @hono/vite-ssg 移行実装イメージ

## 1. インストール

```bash
pnpm add -D @hono/vite-ssg
```

## 2. app.tsx の変更（特定年のみルート登録）

```typescript
// src/app.tsx
import { Hono } from 'hono'
import { Layout } from './components/Layout.js'
import { CalendarGrid } from './components/CalendarGrid.js'
import { generateYearCalendarData } from './lib/calendar-generator.js'

const app = new Hono()

// SSGビルド時: 特定の年のみルートを登録
const currentYear = new Date().getFullYear()
const yearsToGenerate = []

for (let i = -10; i <= 10; i++) {
  yearsToGenerate.push(currentYear + i)
}

// ルートページ（現在年）
app.get('/', (c) => {
  const yearData = generateYearCalendarData(currentYear)
  return c.html(
    <Layout year={currentYear}>
      <CalendarGrid months={yearData.months} />
    </Layout>
  )
})

// 生成対象の年のみルートを登録
yearsToGenerate.forEach(year => {
  app.get(`/${year}`, (c) => {
    const yearData = generateYearCalendarData(year)
    return c.html(
      <Layout year={year}>
        <CalendarGrid months={yearData.months} />
      </Layout>
    )
  })
})

// Vercelサーバーレスでは全年対応（環境変数で判定）
if (process.env.NODE_ENV !== 'ssg_build') {
  app.get('/:year', (c) => {
    const year = parseInt(c.req.param('year'))
    if (isNaN(year) || year < 1900 || year > 2100) {
      return c.redirect('/')
    }
    const yearData = generateYearCalendarData(year)
    return c.html(
      <Layout year={year}>
        <CalendarGrid months={yearData.months} />
      </Layout>
    )
  })
}

export default app
```

## 3. SSG Plugin作成（スクリプト注入）

```typescript
// scripts/ssg-plugin.ts
import type { SSGPlugin } from '@hono/vite-ssg'

export const injectRedirectScript = (): SSGPlugin => {
  const currentYear = new Date().getFullYear()

  return {
    name: 'inject-redirect-script',

    // HTMLをファイルに書き込む直前に実行
    beforeResponseWrite: async (response, path) => {
      // ルートページのみスクリプト注入
      if (path === '/index.html') {
        let html = await response.text()

        const redirectScript = `
    <script>
      (function() {
        var currentYear = new Date().getFullYear();
        var pageYear = ${currentYear};
        if (currentYear !== pageYear) {
          window.location.href = '/' + currentYear;
        }
      })();
    </script>
  `

        // <head>タグの直後に挿入
        html = html.replace('<head>', '<head>' + redirectScript)

        // 新しいResponseオブジェクトを返す
        return new Response(html, {
          status: response.status,
          headers: response.headers,
        })
      }

      // その他のページはそのまま
      return response
    }
  }
}
```

## 4. vite.config.ts の設定

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import ssg from '@hono/vite-ssg'
import { injectRedirectScript } from './scripts/ssg-plugin'

export default defineConfig({
  plugins: [
    ssg({
      entry: './src/app.tsx',
      plugins: [
        injectRedirectScript()
      ]
    })
  ],
  build: {
    // APIは別途ビルド
    lib: {
      entry: {
        api: 'src/api.tsx',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['hono', '@hono/zod-openapi', '@hono/swagger-ui', '@mu373/epiweek', 'luxon'],
    },
  },
  define: {
    // SSGビルド時の環境変数
    'process.env.NODE_ENV': JSON.stringify('ssg_build'),
  }
})
```

## 5. package.json の変更

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

## メリット・デメリット

### メリット
- ✅ ビルドコマンドが1つに統一（`pnpm build`のみ）
- ✅ Viteのビルドパイプラインに完全統合
- ✅ SSG Pluginで拡張可能

### デメリット
- ❌ app.tsxに環境判定ロジックが必要
- ❌ SSG Pluginの作成が必要（追加の学習コスト）
- ❌ 複数エントリポイント（app + api）の扱いが複雑
  - SSGはapp.tsxのみ、apiは通常のlibビルド
  - 設定ファイルが混在して読みにくくなる可能性

### 現在の実装との比較

| 項目 | 現在 | @hono/vite-ssg |
|------|------|----------------|
| ビルドステップ | 2段階 | 1段階（ただし設定複雑） |
| コード分離 | 明確（app/apiが独立） | 混在（環境判定が必要） |
| カスタマイズ | 直感的（TSスクリプト） | プラグイン形式（学習コスト） |
| 保守性 | 高（シンプル） | 中（設定が複雑） |

## 結論

現在のプロジェクトでは、**現状のカスタムスクリプト方式が最適**と判断します。

理由:
1. すでに動作している
2. app/apiの分離が明確
3. カスタムロジックが直感的に書ける
4. ビルドが2段階でも速度に問題なし（数秒）

@hono/vite-ssgは、より標準的な単一Honoアプリ構成で、カスタムロジックが少ない場合に適しています。
