let history: { gaz: number; smoke: number; time: string; }[] = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { gaz, smoke } = req.body;
    const time = new Date().toISOString();
    history.push({ gaz, smoke, time });
    if (history.length > 1000) history.shift();
    return res.status(200).json({ message: 'ok' });
  } else if (req.method === 'GET') {
    const last = history[history.length - 1] || { gaz: 0, smoke: 0, time: new Date().toISOString() };
    return res.status(200).json(last);
  } else {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
}