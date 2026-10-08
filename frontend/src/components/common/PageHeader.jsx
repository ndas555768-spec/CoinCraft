function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-stone-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default PageHeader;
