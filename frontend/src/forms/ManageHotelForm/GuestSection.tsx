import { useFormContext } from 'react-hook-form'
import { HotelFormData } from './ManageHotelForm'

const GuestSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>()

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="flex gap-5 bg-gray-300 p-6">
        <label className="text-gray-700 text-sm font-semibold flex-1">
          Adults
          <input
            type="number"
            min={1}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register('adultCount', { required: 'This field is required.' })}
          ></input>
          {errors.adultCount && (
            <span className="text-red-500">{errors.adultCount.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-semibold flex-1">
          Children
          <input
            type="number"
            min={0}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register('childCount', { required: 'This field is required.' })}
          ></input>
          {errors.childCount && (
            <span className="text-red-500">{errors.childCount.message}</span>
          )}
        </label>
      </div>
    </div>
  )
}

export default GuestSection
