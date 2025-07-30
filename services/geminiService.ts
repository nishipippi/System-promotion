
import { GoogleGenAI, Type } from "@google/genai";
import { ApplicationData, Coordinates, RouteSuggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const routeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      routeName: {
        type: Type.STRING,
        description: "ルート名 (例: 首都高経由ルート)",
      },
      description: {
        type: Type.STRING,
        description: "ルートの特徴に関する簡潔な説明 (例: 最速ですが、有料道路を利用します)",
      },
      estimatedTime: {
        type: Type.INTEGER,
        description: "分単位の推定所要時間",
      },
      path: {
        type: Type.ARRAY,
        description: "ルートを表す緯度経度オブジェクトの配列",
        items: {
            type: Type.OBJECT,
            properties: {
                lat: { type: Type.NUMBER, description: "Latitude" },
                lng: { type: Type.NUMBER, description: "Longitude" },
            },
            required: ["lat", "lng"],
        },
      },
    },
    required: ["routeName", "description", "estimatedTime", "path"],
  },
};

export const getOptimalRoutes = async (
  appData: ApplicationData,
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteSuggestion[]> => {
  const prompt = `
あなたは日本の道路事情と交通情報に精通した、特殊車両の運行管理AIです。
以下の情報に基づき、最適なルートを3つ提案してください。

# 依頼情報
- 事業者名: ${appData.companyName}
- 車両名: ${appData.vehicleName}
- 出発日時: ${appData.departureDateTime}
- 出発地: 緯度 ${origin.lat}, 経度 ${origin.lng}
- 到着地: 緯度 ${destination.lat}, 経度 ${destination.lng}

# 指示
- 出発日時を考慮して、交通渋滞を予測してください。
- 予測に基づき、所要時間、距離、道路の特性（有料道路の有無、大型車通行規制など）を総合的に評価し、3つの異なる特性を持つ最適ルートを提案してください。
- 各ルートについて、ルート名、特徴、推定所要時間（分）、そして地図に描画するための緯度経度オブジェクトの配列（path）を生成してください。各オブジェクトは {"lat": number, "lng": number} の形式です。
- 出発地から到着地まで、少なくとも10個の経由地を含む詳細な経路を生成してください。
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: routeSchema,
    }
  });

  const jsonText = response.text.trim();
  
  try {
    const parsedRoutes: RouteSuggestion[] = JSON.parse(jsonText);
    return parsedRoutes;
  } catch (error) {
    console.error("Failed to parse Gemini response:", jsonText);
    throw new Error("AIからの応答形式が正しくありません。");
  }
};