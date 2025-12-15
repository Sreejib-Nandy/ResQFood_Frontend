const letters = ["R", "e", "s", "Q", "F", "o", "o", "d"];

const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex text-7xl max-md:text-5xl font-bold">
        {letters.map((char, i) => (
          <span
            key={i}
            className={`mx-0.5 ${
              char === "Q" ? "text-[#9ac31f]" : "text-gray-800"
            } animate-wave`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Spinner;

