
const Square = ({ piece, color, id, onDrop, onDragStart, onClick, }) => {
  const isTouch = "ontouchstart" in window;
  return (
    <div
      className={`flex justify-center items-center w-11 h-11 md:h-15 md:w-15 2xl:h-18 2xl:w-18 ${color}`}
      id={id}
      onClick={() => {onClick(id)}}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(id)}
    >
      {piece && (
        <img
          src={piece.img}
          alt={piece.type}
          draggable = {!isTouch}
          onDragStart={() => onDragStart(id)}
          className="cursor-grab w-16 h-16 "
        />
      )}
    </div>
  );
};

export default Square;
