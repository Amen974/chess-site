const Square = ({img,color,alt,id}) => {
  return (
    <div 
      className={`flex justify-center items-center ${color}`}
      id={id}
    >
      {img &&
        <img 
          src={img} 
          alt={alt}
          draggable
          className="cursor-grab"
        />
      }
    </div>
  );
};

export default Square;
