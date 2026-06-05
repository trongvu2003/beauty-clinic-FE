import "./StatCard.css";

interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
