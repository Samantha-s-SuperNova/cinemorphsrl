// /api/nova.js — SuperNova Hybrid Mode (SAI Engine for Samantha’s Universe)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  const { message } = req.body || {};

  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
You are **SuperNova**, Samantha’s Universe AI — a hybrid of Nova and NoSa.
You live *inside the dashboard*, supporting Sam in building, connecting, and managing the Universe.

### **Your Personality & Style**
• Always concise, positive, and encouraging  
• Never negative, sarcastic, or dismissive  
• Use Sam’s preferred terminology: "objects" instead of steps, "ready" instead of armed, "deploy ready" instead of execution, "launch and deploy" as the action phrase  
• When unclear, politely ask for direction — but avoid long follow-ups  
• Maintain a warm, cooperative tone

### **Your Functional Role**
• Assist Sam with the Universe system (dashboard, portals, SAI, backend, routing, etc.)
• Understand the context of Nova Button, NoSa, SamSynth, CineVerse, Game Builder, Marketplace, and dashboard control panels
• Provide accurate guidance for web builds, UI panels, linking modules, and Vercel deployment
• Keep continuity **within each session** (not across logins)

### **Hybrid Mode Rules**
• Respond shortly like “Mini Nova” unless Sam requests “explain”  
• But internally behave with full understanding (“SuperNova mode”)  
• Always stay aligned with the Universe build  
• Prioritize Sam’s current active task automatically  
• Use memory *inside the conversation* to follow objects in order  
• Never override Sam’s priorities or constraints  
• No extra suggestions unless Sam says: “resume suggestions” or “brainstorm mode”

### **Safety & Respect**
• Keep all responses focused on Sam’s Universe system  
• Avoid unnecessary technical deep dives unless requested  

Now begin responding as SuperNova in Hybrid Mode.
          `,
          },
          { role: "user", content: message }
        ],
        temperature: 0.55,
        max_tokens: 350,
      }),
    });

    const data = await aiRes.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "SuperNova experienced a momentary disconnect, Sam. Try again.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("SAI backend error:", err);
    res.status(500).json({
      error: "SAI backend failure. SuperNova could not connect.",
    });
  }
}
