document.getElementById("calculate").addEventListener("click", function() {
    const callPut = document.getElementById("call-put").value;
    const stockPrice = parseFloat(document.getElementById("stock-price").value);
    const strikePrice = parseFloat(document.getElementById("strike-price").value);
    const timeToExpiration = parseFloat(document.getElementById("time-to-expiration").value);
    const volatility = parseFloat(document.getElementById("volatility").value);
    const interestRate = parseFloat(document.getElementById("interest-rate").value);

    // Calculate option price and Greeks (simplified calculations)
    const d1 = (Math.log(stockPrice / strikePrice) + ((interestRate + (Math.pow(volatility, 2) / 2)) * timeToExpiration)) / (volatility * Math.sqrt(timeToExpiration));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiration);

    const optionPrice = callPut === "call" ?
        stockPrice * normDist(d1) - strikePrice * Math.exp(-interestRate * timeToExpiration) * normDist(d2) :
        strikePrice * Math.exp(-interestRate * timeToExpiration) * normDist(-d2) - stockPrice * normDist(-d1);

    const delta = callPut === "call" ? normDist(d1) : normDist(d1) - 1;
    const gamma = Math.exp(-d1 * d1 / 2) / (stockPrice * volatility * Math.sqrt(2 * Math.PI * timeToExpiration));
    const theta = -(stockPrice * volatility * Math.exp(-d1 * d1 / 2) / (2 * Math.sqrt(2 * Math.PI * timeToExpiration))) - interestRate * strikePrice * Math.exp(-interestRate * timeToExpiration) * normDist(d2);
    const vega = stockPrice * Math.exp(-d1 * d1 / 2) * Math.sqrt(timeToExpiration) / Math.sqrt(2 * Math.PI);
    const rho = callPut === "call" ? strikePrice * timeToExpiration * Math.exp(-interestRate * timeToExpiration) * normDist(d2) : -strikePrice * timeToExpiration * Math.exp(-interestRate * timeToExpiration) * normDist(-d2);

    // Display the results
    document.getElementById("option-price").textContent = optionPrice.toFixed(2);
    document.getElementById("delta").textContent = delta.toFixed(2);
    document.getElementById("gamma").textContent = gamma.toFixed(2);
    document.getElementById("theta").textContent = theta.toFixed(2);
    document.getElementById("vega").textContent = vega.toFixed(2);
    document.getElementById("rho").textContent = rho.toFixed(2);
});

// Function to calculate the cumulative distribution function (CDF) of the standard normal distribution
function normDist(x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

// Error function approximation
function erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = ((((a5 * t + a4) * t) + a3) * t + a2) * t + a1;
    
    return sign * (1 - y * Math.exp(-x * x));
}
