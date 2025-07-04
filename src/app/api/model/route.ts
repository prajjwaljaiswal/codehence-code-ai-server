import { NextResponse } from "next/server";
import { modelConfig } from "./config";

export async function POST() {

    const config = modelConfig.map(item => {
        return {
            label: item.modelName,
            value: item.modelKey,
            useImage: item.useImage,
            description: item.description,
            icon: item.iconUrl,
            provider: item.provider,
            functionCall: item.functionCall,
        }
    })
     return NextResponse.json(config);
}
