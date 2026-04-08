
function formatePrice(price, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: 'narrowSymbol',
    }).format(price);
}

export default formatePrice