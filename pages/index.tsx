import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function Dashboard() {
  const [dataPoints, setDataPoints] = useState<{ time: string; gaz: number; smoke: number; }[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      const now = new Date().toLocaleTimeString();
      setDataPoints(prev => [...prev.slice(-99), { time: now, gaz: json.gaz, smoke: json.smoke }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: dataPoints.map(p => p.time),
    datasets: [
      {
        label: 'Gaz',
        data: dataPoints.map(p => p.gaz),
        borderColor: 'red',
        fill: false,
      },
      {
        label: 'Fumée',
        data: dataPoints.map(p => p.smoke),
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  const exportCSV = () => {
    let csv = "temps,gaz,fumee\n";
    dataPoints.forEach(p => {
      csv += `${p.time},${p.gaz},${p.smoke}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donnees.csv';
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Gaz & Fumée</h1>
      <Line data={chartData} />
      <div className="mt-4">
        <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">Exporter CSV</button>
      </div>
    </div>
  );
}