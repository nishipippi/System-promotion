# 特殊車両通行許可申請システム

## 概要

AIが交通状況、車両情報、日時などを考慮し、特殊車両のための最適な通行ルートを提案するWebアプリケーションです。運送事業者が通行許可を申請する際のルート選定を効率化し、安全性を向上させることを目的としています。

このデモでは、Google Gemini APIを利用して、ユーザーが入力した情報に基づき複数の最適なルート候補を生成・提案します。

## ✨ 主な機能

*   **申請フォーム**: 事業者名、車両情報、出発日時を簡単に入力できます。
*   **インタラクティブマップ**: 地図をクリックするだけで、直感的に出発地と到着地を設定できます。
*   **AIによるルート提案**: Google Gemini APIを利用して、入力情報に基づいた最大3つの最適ルートを提案します。
*   **ルートの可視化**: 提案された各ルートを地図上にポリラインで描画し、視覚的に比較・確認できます。
*   **動的なUI**: `Framer Motion`による滑らかなアニメーションで、快適なユーザー体験を提供します。
*   **レスポンシブデザイン**: デスクトップからモバイルまで、様々なデバイスで利用可能です。

## 🛠️ 使用技術

| カテゴリ       | 技術                                                                                             |
| :------------- | :----------------------------------------------------------------------------------------------- |
| **フロントエンド** | [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)                     |
| **AIモデル**     | [Google Gemini API](https://ai.google.dev/)                                                      |
| **地図**         | [React Leaflet](https://react-leaflet.js.org/) (OpenStreetMap)                                   |
| **スタイリング**   | [Tailwind CSS](https://tailwindcss.com/)                                                         |
| **アニメーション** | [Framer Motion](https://www.framer.com/motion/)                                                  |
| **ビルドツール**   | [Vite](https://vitejs.dev/) (想定)                                                               |

## 🚀 セットアップと実行方法

### 1. リポジトリをクローン

```bash
git clone https://github.com/your-username/special-vehicle-routing-system.git
cd special-vehicle-routing-system
```

### 2. 依存関係をインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数を設定

プロジェクトのルートディレクトリに `.env.local` という名前のファイルを作成し、お使いのGoogle Gemini APIキーを設定してください。

```.env.local
# .env.local

# Google Gemini APIキー
VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

> **Note**: APIキーは[Google AI Studio](https://makersuite.google.com/app/apikey)から取得できます。

### 4. 開発サーバーを起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで `http://localhost:5173` (またはターミナルに表示されたアドレス) を開くと、アプリケーションが表示されます。

## 📝 APIについて

このプロジェクトでは、`./src/services/geminiService.ts` 内でGoogle Gemini APIとの通信を管理しています。APIに送信するプロンプトを調整することで、提案されるルートの条件（例: 高速道路を優先、大型車が通行可能な道幅を考慮など）をカスタマイズすることが可能です。

現状はシミュレーションですが、実際の交通情報API（例: Google Maps Directions API）と組み合わせることで、より精度の高いリアルタイムなルート提案を実現できます。
