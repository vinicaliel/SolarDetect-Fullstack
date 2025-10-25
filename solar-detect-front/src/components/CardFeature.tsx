interface CardFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function CardFeature({ title, description, icon }: CardFeatureProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <div className="text-green-700 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
