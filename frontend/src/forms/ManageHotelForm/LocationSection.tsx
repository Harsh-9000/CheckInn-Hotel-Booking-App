import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { useFormContext } from 'react-hook-form'
import { HotelFormData } from './ManageHotelForm'

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?'

interface Address {
  house_number?: string
  road?: string
  hamlet?: string
  town?: string
  city?: string
  state_district?: string
  state?: string
  postcode?: string
  country?: string
  country_code?: string
}

interface Location {
  osm_id: number
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: Address
}

interface ResetCenterViewProps {
  selectPosition: Location | null
}

function ResetCenterView({ selectPosition }: ResetCenterViewProps) {
  const map = useMap()

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(
          parseFloat(selectPosition.lat),
          parseFloat(selectPosition.lon)
        ),
        map.getZoom(),
        {
          animate: true,
        }
      )
    }
  }, [selectPosition])

  return null
}

const LocationSection = () => {
  const { register, setValue } = useFormContext<HotelFormData>()
  const [searchText, setSearchText] = useState('')
  const [listPlace, setListPlace] = useState<Location[]>([])
  const [selectPosition, setSelectPosition] = useState<Location | null>(null)
  const locationSelection: LatLngTuple = selectPosition
    ? [parseFloat(selectPosition.lat), parseFloat(selectPosition.lon)]
    : [20.5937, 78.9629]

  useEffect(() => {
    register('latitude')
    register('longitude')
  }, [register])

  useEffect(() => {
    if (selectPosition) {
      setValue('latitude', selectPosition.lat)
      setValue('longitude', selectPosition.lon)
    }
  }, [selectPosition, setValue])

  return (
    <>
      <h2 className="text-2xl font-bold">Location</h2>
      <div className="flex flex-col md:flex-row w-full h-96">
        {/* Map */}
        <div className="w-1/2 h-full">
          <MapContainer
            center={locationSelection}
            zoom={17}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectPosition && (
              <Marker position={locationSelection}>
                <Popup>{selectPosition?.display_name}</Popup>
              </Marker>
            )}

            <ResetCenterView selectPosition={selectPosition} />
          </MapContainer>
        </div>

        {/* Search Box */}
        <div className="w-1/2 flex flex-col items-start">
          <div className="flex w-full space-x-2 px-4">
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full border border-gray-300 p-2 rounded"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value)
              }}
            />
            <button
              type="button"
              className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-l disabled:bg-gray-500"
              onClick={() => {
                const params = {
                  q: searchText,
                  format: 'json',
                  addressdetails: '1',
                  polygon_geojson: '0',
                }

                const queryString = new URLSearchParams(params).toString()

                const requestOptions: RequestInit = {
                  method: 'GET',
                  redirect: 'follow' as RequestRedirect,
                }

                fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                  .then((response) => response.json())
                  .then((result: Location[]) => {
                    setListPlace(result)
                  })
                  .catch((error) => console.log('Error: ', error))
              }}
            >
              Search
            </button>
          </div>
          <div className="w-full px-4">
            <ul className="divide-y divide-gray-300 border rounded-md max-h-80 overflow-y-auto">
              {listPlace.map((location) => (
                <li
                  key={location?.place_id}
                  className="flex flex-col p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectPosition(location)
                    setListPlace([])
                  }}
                >
                  <span className="font-medium flex">
                    <FaMapMarkerAlt className="mt-1 text-[#1e40af] mr-1" />
                    {location?.display_name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default LocationSection
