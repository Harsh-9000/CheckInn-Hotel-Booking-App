import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
import { FaMapMarkerAlt } from 'react-icons/fa'
import * as apiClient from '../api-client'
import GuestInfoForm from '../forms/GuestInfoForm/GuestInfoForm'
import { facilityIconMap } from '../config/hotel-options-config'
import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import locationPinIcon from '../assets/location-pin.png' 

const customIcon = new L.Icon({
  iconUrl: locationPinIcon,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
})

const Detail = () => {
  const { hotelId } = useParams()

  const { data: hotel } = useQuery(
    ['fetchHotelById', hotelId],
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
      initialData: null,
    }
  )

  const [isMapModalOpen, setMapModalOpen] = useState(false)
  const [isImageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  if (!hotel) {
    return <></>
  }

  const openMapModal = () => {
    setMapModalOpen(true)
  }

  const closeMapModal = () => {
    setMapModalOpen(false)
  }

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setImageModalOpen(true)
  }

  const closeImageModal = () => {
    setImageModalOpen(false)
  }

  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === hotel.imageUrls.length - 1 ? 0 : prevIndex + 1
    )
  }

  const showPrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? hotel.imageUrls.length - 1 : prevIndex - 1
    )
  }

  return (
    <div>
      <div className="mb-6">
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <span className="flex gap-1">
          <FaMapMarkerAlt className="mt-1 text-[#1e40af]" />
          <h6>{`${hotel.address}, ${hotel.city}, ${hotel.country}`}</h6>
          <a
            onClick={openMapModal}
            className="text-blue-600 cursor-pointer hover:underline block"
          >
            Show on map
          </a>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {hotel.imageUrls.map((url, index) => (
          <div
            key={index}
            className={`${
              index === 1 ? 'col-span-2 row-span-2' : 'h-[250px]'
            } cursor-pointer relative group`}
            onClick={() => openImageModal(index)}
          >
            <img
              src={url}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center group-hover:brightness-75 transition duration-300"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-6">
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
        <div className="whitespace-pre-line mr-5">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>

      {/* Modal for Map */}
      {isMapModalOpen && (
        <div
          onClick={closeMapModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-11/12 lg:w-1/2 h-[600px] bg-white rounded-lg p-9"
          >
            <button
              onClick={closeMapModal}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-black hover:text-white transition-colors duration-200 pb-1 pr0.5 text-xl"
            >
              &times;
            </button>
            <MapContainer
              center={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]}
              zoom={17}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[
                  parseFloat(hotel.latitude),
                  parseFloat(hotel.longitude),
                ]}
                icon={customIcon}
              >
                <Popup>{`${hotel.name}, ${hotel.address}`}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          onClick={closeImageModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full lg:w-2/3 h-5/6 bg-white rounded-lg p-5 overflow-hidden"
          >
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-black hover:text-white transition-colors duration-200 pb-1 pr-0.5 pr0.5 text-2xl"
            >
              &times;
            </button>
            <div className="flex justify-between items-center">
              <button
                onClick={showPrevImage}
                className="text-white bg-black pb-1 w-10 h-10 rounded-full hover:bg-slate-300 hover:text-black text-2xl mr-2"
              >
                &#60;
              </button>
              <img
                src={hotel.imageUrls[selectedImageIndex]}
                alt="Hotel"
                className="w-10.5/12 min-w-[120vh] max-w-[120vh] min-h-[78vh] max-h-[78vh] sm:max-h-[70vh] md:max-h-[80vh] lg:max-h-[78vh] object-cover rounded-lg"
              />
              <button
                onClick={showNextImage}
                className="text-white bg-black pb-1 w-10 h-10 rounded-full hover:bg-slate-300 hover:text-black text-2xl ml-2"
              >
                &#62;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
