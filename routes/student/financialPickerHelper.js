function firstChoice(variant) {
    variant = Number(variant);
    currentPay = 5000;
    if (variant === 1) {
        return {
            jobName: "Grafiči dizajn",
            jobPayment: 5500-currentPay,  // current pay = 5000
            jobCredit: 640,
            duration: 4,
        }
    } else if (variant === 2) {
        return {
            jobName: "Školovanje",
            jobPayment: 7000-currentPay, // current pay = 5000
            jobCredit: 2348,
            duration: 5
        }
    }
}

function unexpectedOutcome(variant) {
    variant = Number(variant);
    if (variant === 1) {
        return {            // U slucaju da je korisnik izabra graficki dizajn prethodno
            outcome: 5600, // Sveukupno => mjesecno = 5600/12/4 s odmakon od 3%
            duration: 4,
        }
    } else if (variant === 2) {
        return {           // U slucaju da je korisnik izabra skolovanje prethodno
            outcome: 7200,  // Sveukupno => mjesecno = 7200/12/4 s odmakon od 3%
            duration: 5
        }
    }
}


function investment(variant) {
    variant = Number(variant);
    let interestRate = null;
    if (variant === 1) {
        interestRate = 0;   // Korisnik nije izaša iz minusa
    } else if (variant === 2) {
        interestRate = 0.5;    // Oročena štednja u banci
    } else if (variant === 3) {
        interestRate = 4;    // Investicijski fond
    } else if (variant === 4) {
        interestRate = 6     // Državne obveznice
    }

    return interestRate
}

module.exports = {
    firstChoice,
    unexpectedOutcome,
    investment,
};