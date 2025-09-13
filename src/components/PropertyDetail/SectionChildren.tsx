const SectionChildren = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="w-full py-8 space-y-12 border-b border-g9">
      <h2 className="pb-4 border-b-2 text-h5 border-primary w-fit">{title}</h2>

      {children}
    </div>
  );
};

export default SectionChildren;
