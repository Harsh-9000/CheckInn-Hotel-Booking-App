import express, { Request, Response } from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import { body } from 'express-validator'
import Hotel from '../models/hotel'
import { HotelType } from '../shared/types'
import verifyToken from '../middleware/auth'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

router.post(
  '/',
  verifyToken,
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('city').notEmpty().withMessage('City is required.'),
    body('country').notEmpty().withMessage('Country is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('type').notEmpty().withMessage('Hotel type is required.'),
    body('facilities')
      .notEmpty()
      .isArray()
      .withMessage('Facilities are required.'),
    body('pricePerNight')
      .notEmpty()
      .isNumeric()
      .withMessage('Price per night is required and must be a number.'),
  ],
  upload.array('imageFiles', 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[]
      const newHotel: HotelType = req.body

      const imageUrls = await uploadImages(imageFiles)

      newHotel.imageUrls = imageUrls
      newHotel.lastUpdated = new Date()
      newHotel.userId = req.userId

      const hotel = new Hotel(newHotel)
      await hotel.save()

      res.status(201).send(hotel)
    } catch (error) {
      console.log('Error in create hotel route: ', error)
      res.status(500).json({ message: 'Something went wrong.' })
    }
  }
)

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId })
    res.json(hotels)
  } catch (error) {
    console.log('Error in get hotels route: ', error)
    res.status(500).json({ message: 'Error fetching hotels.' })
  }
})

router.get('/:hotelId', verifyToken, async (req: Request, res: Response) => {
  const hotelId = req.params.hotelId.toString()

  try {
    const hotel = await Hotel.findOne({
      _id: hotelId,
      userId: req.userId,
    })

    res.json(hotel)
  } catch (error) {
    console.log('Error in get hotel by ID route: ', error)
    res.status(500).json({ message: 'Error fetching hotels.' })
  }
})

router.put(
  '/:hotelId',
  verifyToken,
  upload.array('imageFiles'),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body
      updatedHotel.lastUpdated = new Date()

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      )

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found.' })
      }

      const files = req.files as Express.Multer.File[]
      const updatedImageUrls = await uploadImages(files)

      hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]

      await hotel.save()
      res.status(201).json(hotel)
    } catch (error) {
      console.log('Error in update hotel route: ', error)
      res.status(500).json({ message: 'Something went wrong.' })
    }
  }
)

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64')
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64
    const res = await cloudinary.v2.uploader.upload(dataURI)
    return res.url
  })

  const imageUrls = await Promise.all(uploadPromises)
  return imageUrls
}

export default router
