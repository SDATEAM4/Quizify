export const CourseCard = ({ 
  title, 
  description, 
  imageUrl, 
  iconClass,
  onClick 
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
      onClick={onClick}
    >
      {/* Course Image */}
      <div className="h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      
      {/* Course Content */}
      <div className="p-4">
        {/* Title and Icon */}
        <div className="flex items-center mb-3">
          <i className={`${iconClass} text-black mr-3 text-xl`}></i>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};
