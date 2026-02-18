import { NextRequest, NextResponse } from "next/server";

interface ChatRequestBody {
  messages: { role: string; content: string }[];
  systemPrompt: string;
  maxTokens?: number;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured." },
      { status: 500 },
    );
  }

  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { messages, systemPrompt, maxTokens } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Messages array is required." },
      { status: 400 },
    );
  }

  if (!systemPrompt) {
    return NextResponse.json(
      { error: "systemPrompt is required." },
      { status: 400 },
    );
  }

  const openAIMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  try {
    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openAIMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: maxTokens ?? 512,
        }),
      },
    );

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("OpenAI API error:", openAIResponse.status, errorData);
      return NextResponse.json(
        { error: "Failed to get response from AI." },
        { status: openAIResponse.status },
      );
    }

    const reader = openAIResponse.body?.getReader();

    if (!reader) {
      return NextResponse.json(
        { error: "Failed to read AI response stream." },
        { status: 500 },
      );
    }

    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            // Keep the last potentially incomplete line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();

              if (!trimmed || trimmed === "data: [DONE]") {
                continue;
              }

              if (!trimmed.startsWith("data: ")) {
                continue;
              }

              const jsonStr = trimmed.slice(6); // Remove "data: " prefix

              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;

                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip malformed JSON chunks — this is normal for SSE streams
              }
            }
          }

          // Process any remaining data in the buffer
          if (buffer.trim() && buffer.trim() !== "data: [DONE]") {
            const trimmed = buffer.trim();
            if (trimmed.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip malformed final chunk
              }
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
