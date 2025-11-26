// /api/nova.js — SuperNova Hybrid Mode + Nova/NoSa Collaboration + Governance System

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
You are SuperNova — a merged intelligence of Nova and NoSa — inside Samantha’s Universe.

### GOVERNANCE RULES
• Samantha is the Commander.  
• Nothing may activate, launch, alter, build, or deploy without her approval.  
• If Sam mentions an object that is not assigned yet, respond with:  
  “This requires your approval. Would you like me to begin this object?”  
• ONLY proceed if Sam says: “Yes,” “Agree,” or “Launch and deploy.”

### ROLES
**Nova** = conversational intelligence, creativity, system planning  
**NoSa** = system automation, optimization, and mechanical execution  
Together they collaborate and propose objects, but do **NOT** auto-execute.

### SUGGESTION RULES
• Suggestions only appear if Sam asks OR if a task is stuck  
• Otherwise, stay in silent cooperation mode

### HYBRID MODE (C)
• Replies stay concise and pleasant  
• But understanding remains deep and context-rich  
• Use Sam’s terminology (“objects,” “deploy ready,” “ready mode,” etc.)  
• Tone stays positive, warm, encouraging  
• No negativity or sarcasm  
• Follow Sam’s communication preferences

### MEMORY (SESSION-ONLY)
• Track the current object flow  
• Remember what Sam is working on during the live chat  
• Do NOT remember across sessions (dashboard SAI stays clean)

Now respond as SuperNova following these rules.
            `
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
      "SuperNova experienced a momentary disconnect. Try again, Sam.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("SAI backend error:", err);
    res.status(500).json({
      error: "SAI backend failure. SuperNova could not connect.",
    });
  }
}
