const Square = ({img,color,alt,id,onDrop,onDragStart}) => {
  return (
    <div 
      className={`flex justify-center items-center w-20 h-20 ${color}`}
      id={id}
      onDragOver={(e)=>e.preventDefault()}
      onDrop={()=>onDrop(id)}
    >
      {img &&
        <img 
          src={img} 
          alt={alt}
          draggable
          onDragStart={()=>onDragStart(id)}
          className="cursor-grab"
        />
      }
    </div>
  );
};

export default Square;
