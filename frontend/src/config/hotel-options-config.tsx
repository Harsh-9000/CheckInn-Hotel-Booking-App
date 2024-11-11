import { IoIosWifi, IoMdFitness } from 'react-icons/io'
import {
  MdAirportShuttle,
  MdFamilyRestroom,
  MdOutlinePool,
} from 'react-icons/md'
import { FaSpa } from 'react-icons/fa'
import { TbSmokingNo} from 'react-icons/tb'
import { FaSquareParking } from 'react-icons/fa6'
import { ReactElement } from 'react'

export const hotelTypes = [
  'Budget',
  'Boutique',
  'Luxury',
  'Ski Resort',
  'Business',
  'Family',
  'Romantic',
  'Hiking Resort',
  'Cabin',
  'Beach Resort',
  'Golf Resort',
  'Motel',
  'All Inclusive',
  'Pet Friendly',
  'Self Catering',
]

export const hotelFacilities = [
  'Free WiFi',
  'Parking',
  'Airport Shuttle',
  'Family Rooms',
  'Non-Smoking Rooms',
  'Outdoor Pool',
  'Spa',
  'Fitness Center',
]

export const facilityIconMap: { [key: string]: ReactElement } = {
  'Free WiFi': <IoIosWifi className="text-[#008234]" />,
  Parking: <FaSquareParking className="text-[#008234]" />,
  'Airport Shuttle': <MdAirportShuttle className="text-[#008234]" />,
  'Family Rooms': <MdFamilyRestroom className="text-[#008234]" />,
  'Non-Smoking Rooms': <TbSmokingNo className="text-[#008234]" />,
  'Outdoor Pool': <MdOutlinePool className="text-[#008234]" />,
  Spa: <FaSpa className="text-[#008234]" />,
  'Fitness Center': <IoMdFitness className="text-[#008234]" />,
}
