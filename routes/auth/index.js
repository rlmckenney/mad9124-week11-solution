import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import authUser from '../../middleware/authUser.js'
import express from 'express'
const router = express.Router()

router.post('/users', sanitizeBody, async (req, res) => {
  try {
    const newUser = new User(req.sanitizedBody)

    const itExists = Boolean(
      await User.countDocuments({ email: newUser.email })
    )

    if (itExists) {
      return res.status(400).send({
        errors: [
          {
            status: '400',
            title: 'Validation Error',
            description: `Email address ${newUser.email} is already registered`,
            source: { pointer: '/data/attributes/email' },
          },
        ],
      })
    }
    await newUser.save()

    res.status(201).send({ data: newUser })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server Error',
          description: 'Problem saving document to the database',
        },
      ],
    })
  }
})

router.get('/users/me', authUser, async (req, res) => {
  req.user._id
  const user = await User.findById(req.user._id)
  res.send({ data: user })
})

// Login a user and return an authentication token.
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  const authenticatedUser = await User.authenticate(email, password)

  if (!authenticatedUser) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Incorrect username or password',
        },
      ],
    })
  }

  res
    .status(201)
    .send({ data: { token: authenticatedUser.generateAuthToken() } })
})

export default router
