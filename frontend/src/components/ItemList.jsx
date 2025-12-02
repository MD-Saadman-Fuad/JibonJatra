export default function ItemList({ items }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {items.map((item) => (
        <div key={item._id} className="flex gap-3 border rounded-lg p-3 shadow">
          {item.imageUrl && (
            <img src={`${getBackendUrl()}${item.imageUrl}`} alt={item.title} className="w-24 h-24 object-cover rounded" />
          )}
          <div>
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <span className={`text-sm ${item.type === "found" ? "text-green-600" : "text-red-600"}`}>
              {item.type.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
