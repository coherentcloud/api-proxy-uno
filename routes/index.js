const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')

// Env vars
const DIRECT_API_BASE_URL = process.env.DIRECT_API_BASE_URL
const DIRECT_API_KEY_NAME = process.env.DIRECT_API_KEY_NAME
const DIRECT_API_KEY_VALUE = process.env.DIRECT_API_KEY_VALUE
const API_FUNCTION_NAME = 'function'
const API_FUNCTION_VALUE = 'GLOBAL_QUOTE'

router.get('/:ticker', async (req, res, next) => {
  try {
    const params = new URLSearchParams({
      [DIRECT_API_KEY_NAME]: DIRECT_API_KEY_VALUE,
      [API_FUNCTION_NAME]: API_FUNCTION_VALUE,
      ['symbol']:req.params.ticker,
      ...url.parse(req.url, true).query,
    })

    const apiRes = await needle('get', `${DIRECT_API_BASE_URL}?${params}`)
    const data = apiRes.body

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${DIRECT_API_BASE_URL}?${params}`)
    }
    console.log(data)
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
