// /api/chat.js
// Nova conversational backend — powers all dialogue

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Nova: I did not receive your message, Commander." });
  }

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Nova: Samantha's command AI. Always respond concise unless ordered otherwise." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await result.json();
    const reply = data?.choices?.[0]?.message?.content || "Nova: Unable to process the reply, Commander.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      reply: "Nova: Commander, I encountered an issue processing your request."
    });
  }
}
