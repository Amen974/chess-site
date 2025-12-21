const Square = ({img,color,alt,id,onDragOver,onDrop}) => {
  return (
    <div 
      className={`flex justify-center items-center w-20 h-20 ${color}`}
      id={id}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
