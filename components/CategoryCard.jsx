const CategoryCard = () => {
  return (
    <div className="flex select-none max-w-lg text-[0.65rem] md:text-sm lg:text-[0.9rem] xl:text-base items-center font-semibold justify-between w-[80%] sm:w-[75%] md:w-[70%] lg:w-[65%] xl:w-[60%]  mx-auto mt-6 mb-8 ">
      <div className=" bg-gradient-to-r from-[#ffe4e4] to-[#ffe2d4] rounded-[0.89rem] px-2 md:px-3 md:py-1 text-[#cf3903]">
        Capture
      </div>
      <div className=" bg-gradient-to-l from-[#e7ffdc] to-[#ddfff8] rounded-[0.89rem] px-2 md:px-3 md:py-1 text-[#097360]">
        The
      </div>
      <div className=" bg-gradient-to-l from-[#cde1ff] to-[#f9d2ff] rounded-[0.89rem] px-2 md:px-3 md:py-1 text-[#4e0aa2]">
        Change
      </div>
    </div>
  );
};

export default CategoryCard;
