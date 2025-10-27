interface CardFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function CardFeature({ icon, title, description }: CardFeatureProps) {
  return (
    <div className="bg-white border rounded-lg shadow-md p-6 flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-xl">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
