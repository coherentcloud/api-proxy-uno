const quoteDisplay = document.querySelector('.quotes')
const responseJSON = document.querySelector('.response')
const tickerForm = document.querySelector('#ticker-form')
const symbolInput = document.querySelector('#symbol-input')

// Fetch weather data from API
const fetchQuotes = async (symbolInput) => {
  const url = `/api/${symbolInput}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.cod === '404') {
    alert('Ticker not found')
    return
  }

  if (data.cod === 401) {
    alert('Invalid API Key')
    return
  }

  //var dataAsJSON = JSON.parse(data.json)
  var rawPrice = data['Global Quote']['05. price']
  var rawPrevious = data['Global Quote']['08. previous close']
  const displayData = {
    ticker: data['Global Quote']['01. symbol'],
    price: rawPrice,
    priceInDollars: stringToDollars(rawPrice),
    previous: rawPrevious,
    previousInDollars: stringToDollars(rawPrevious),
    dailyChange: data['Global Quote']['10. change percent'],
    lasttradingdate: data['Global Quote']['07. latest trading day'],
  }

  addResultsToDOM(displayData)

}

// Add display data to DOM
const addResultsToDOM = (displayData) => {
  quoteDisplay.innerHTML = `
    <h2>Quotes for ${displayData.ticker}</h2>
    <h3>Latest Price:${displayData.priceInDollars}</h3>
    <h3>Previous Close: ${displayData.previousInDollars}</h3>
    <h4>Daily Change: ${displayData.dailyChange}</h4>
    <br/><br/>
  `
  symbolInput.value = ''
}

// Convert Kelvin to Fahrenheit
const stringToDollars = (price) => {
  var formatter = Intl.NumberFormat('en-US' , {
    style: 'currency',
    currency: 'USD',})
  return formatter.format(price)
}

// Event listener for form submission
tickerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (symbolInput.value === '') {
    alert('Please enter a valid stock ticker or symbol')
  } else {
    fetchQuotes(symbolInput.value)
  }
})

// Initial fetch
fetchQuotes('VOO')
