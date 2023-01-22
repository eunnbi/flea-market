const EmptyText = ({ children }: React.PropsWithChildren) => {
  return (
    <p className="text-center text-gray flex flex-1 justify-center items-center">
      {children}
    </p>
  );
};

export default EmptyText;
