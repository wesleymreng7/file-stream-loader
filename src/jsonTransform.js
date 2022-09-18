const { Transform } = require('stream')

class JsonTransform extends Transform {
    constructor (options = {}) {
        super({ ...options })
        this.once('data', this.startJson)
        this.firstLine = true
    }

    startJson() {
        this.push('[')
    }
    _transform (chunk, encoding, callback) {
        const row = JSON.parse(chunk.toString())
        const newChunk = this.firstLine ? `${JSON.stringify(row)}` : `,${JSON.stringify(row)}`
        this.push(newChunk)
        if(this.firstLine) {
            this.firstLine = false
        }
        callback()
    }
    _flush(callback) {
        this.push(']')
        callback()
    }
    
}

module.exports = JsonTransform