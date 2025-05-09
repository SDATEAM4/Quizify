import { useEffect, useState } from 'react';

export const CourseCard = ({ 
  title, 
  description,
  imageUrl,
  fallback
}) => {
  useEffect(()=>{
    if(imageUrl === null){
      setImgSrc(fallback)
    }
  },[])
  const [imgSrc, setImgSrc] = useState(imageUrl);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer">
      
      {/* Course Image */}
      <div className="h-40 overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover object-top"
          onError={() => {
            setImgSrc(fallback);
          }}
        />
      </div>
      
      {/* Course Content */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

    </div>
  );
};
