export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <Icon size={48} className="text-slate-400" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}
