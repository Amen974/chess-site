
const Square = ({ piece, color, id, onDrop, onDragStart }) => {
  
  return (
    <div
      className={`flex justify-center items-center w-11 h-11 md:h-15 md:w-15 2xl:h-18 2xl:w-18 ${color}`}
      id={id}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(id)}
    >
      {piece && (
        <img
          src={piece.img}
          alt=""
          draggable
          onDragStart={() => onDragStart(id)}
          className="cursor-grab w-16 h-16 "
        />
      )}
    </div>
  );
};

export default Square;
