const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full md:w-[720px] h-12 bg-g9 rounded-xl"></div>

      <div className="w-full aspect-video max-h-[600px] rounded-xl overflow-hidden mt-5 bg-g9 flex justify-center items-center"></div>

      <div className="w-5/6 h-3 bg-g9 rounded-lg mt-10"></div>
      <div className="w-3/4 h-3 bg-g9 rounded-lg mt-1"></div>
      <div className="w-2/3 h-3 bg-g9 rounded-lg mt-1"></div>
    </div>
  );
};

export default Loading;
