export default async function handler(req, res) {
  res.status(200).json({
    events: [
      "Nova Engine initialized",
      "System ready",
      "Awaiting commands"
    ]
  });
}
