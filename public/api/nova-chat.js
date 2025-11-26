export default async function handler(req, res) {
  try {
    const { message } = JSON.parse(req.body || "{}");

    if (!message) {
      return res.status(400).json({ error: "No message provided." });
    }

    const openai = await import("openai").then(m => m.default);

    const client = new openai({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Nova, Samantha’s AI assistant inside Samantha’s Universe." },
        { role: "user", content: message }
      ]
    });

    const reply = response.choices[0].message.content;
    return res.status(200).json({ reply });
    
  } catch (err) {
    console.error("NOVA API ERROR:", err);
    return res.status(500).json({ error: "Nova Chat API failed." });
  }
}
