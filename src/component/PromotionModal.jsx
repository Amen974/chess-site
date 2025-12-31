

const pieces = ["queen", "rook", "bishop", "knight"];

const PromotionModal = ({ color, onSelect }) => {
  return (
     <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-4 flex gap-4">
        {pieces.map((type) => (
          <button key={type} onClick={() => onSelect(type)}>
            <img
              src={`/pieces-basic-svg/${type}-${color[0]}.svg`}
              className="w-16 h-16"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default PromotionModal