const { PassThrough } = require('stream')

class MonitorTransform extends PassThrough {
    constructor(options = {}) {
        super({ ...options })
        this.on('data', this.processData)
        this.on('close', this.showResult)
        this.totalCrimes = 0
        this.boroughTotal = new Map()
        this.monthTotal = new Map()
        this.yearTotal = new Map()
    }

    processData(data) {
        const row = JSON.parse(data.toString())
        const rowCrimeQuantity = Number(row.value) || 0
        const currentBoroughTotal = Number(this.boroughTotal.get(row.borough)) || 0
        const currentMonthTotal = Number(this.monthTotal.get(row.month)) || 0
        const currentYearTotal = Number(this.yearTotal.get(row.year)) || 0

        this.totalCrimes += rowCrimeQuantity
        this.boroughTotal.set(row.borough, currentBoroughTotal + rowCrimeQuantity)
        this.monthTotal.set(row.month, currentMonthTotal + rowCrimeQuantity)
        this.yearTotal.set(row.year, currentYearTotal + rowCrimeQuantity)
    }


    showResult() {
        console.log(this.totalCrimes)
        console.log(this.boroughTotal)
        console.log(this.monthTotal)
        console.log(this.yearTotal)
    }
}


module.exports = MonitorTransform