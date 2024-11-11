import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
import { FaMapMarkerAlt } from 'react-icons/fa'
import * as apiClient from '../api-client'
import GuestInfoForm from '../forms/GuestInfoForm/GuestInfoForm'
import { facilityIconMap } from '../config/hotel-options-config'

const Detail = () => {
  const { hotelId } = useParams()

  const { data: hotel } = useQuery(
    'fetchHotelById',
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  )

  if (!hotel) {
    return <></>
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <span className="flex gap-1">
          <FaMapMarkerAlt className="mt-1 text-[#1e40af]" />
          <h6>{`${hotel.address}, ${hotel.city}, ${hotel.country}`}</h6>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((url, index) => (
          <div
            key={index}
            className={`
        ${index === 1 ? 'col-span-2 row-span-2' : 'h-[250px]'}
      `}
          >
            <img
              src={url}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div
            key={facility}
            className="border border-slate-300 rounded-sm p-3 flex items-center gap-2"
          >
            {facilityIconMap[facility] || null}
            <span>{facility}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  )
}

export default Detail
