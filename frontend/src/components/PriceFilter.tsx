type Props = {
  selectedPrice?: number
  onChange: (value?: number) => void
}

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        title="priceName"
        className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Select Max Price</option>
        {[10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000].map(
          (price, index) => (
            <option key={index} value={price}>
              {price}
            </option>
          )
        )}
      </select>
    </div>
  )
}

export default PriceFilter
