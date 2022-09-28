const express = require('express')
const cors = require('cors')
const axios = require('axios')
const errorHandler = require('./middleware/error')
const { query } = require('express')

const app = express()

app.use(cors())

// Set static folder
app.use(express.static('public'))

const RAPID_API_BASE_URL = process.env.RAPID_API_BASE_URL
const RAPID_API_KEY_NAME = process.env.RAPID_API_KEY_NAME
const RAPID_API_KEY_VALUE = process.env.RAPID_API_KEY_VALUE
const RAPID_API_KEY_HOST_NAME = process.env.RAPID_API_KEY_HOST_NAME
const RAPID_API_KEY_HOST_VALUE = process.env.RAPID_API_KEY_HOST_VALUE
const API_FUNCTION_NAME = 'function'
const API_FUNCTION_VALUE = 'GLOBAL_QUOTE'

app.get('/quote/:ticker', (req, res) =>{

    const symbol = req.params.ticker

    const query_params = new URLSearchParams({
        [`${API_FUNCTION_NAME}`]: `${API_FUNCTION_VALUE}`,
        ['symbol']: symbol,
        ['datatype']: 'json'
      })

    const options = {
        method: 'GET',
        url: `${RAPID_API_BASE_URL}`,
        params: {[`${API_FUNCTION_NAME}`]: API_FUNCTION_VALUE, symbol: symbol, datatype: 'json'},
        headers: {
            [RAPID_API_KEY_NAME]: RAPID_API_KEY_VALUE,
            [RAPID_API_KEY_HOST_NAME]: RAPID_API_KEY_HOST_VALUE
        }
    };

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
        console.log(`REQUEST: ${RAPID_API_BASE_URL}?${ query_params }`)
    }

    axios.request(options).then(function (response) {

        const data = response.data
      
        console.log(response.data);

        res.status(200).json(data)
        
    }).catch(function (error) {
        console.error(error);
    });

})

// Routes
app.use('/api', require('./routes'))

// Error handler middleware
app.use(errorHandler)

const PORT =  process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))