export default function ProductCardSkeleton() {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    );
  }
  