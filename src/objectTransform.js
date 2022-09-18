const { Transform } = require('stream')

class ObjectTranform extends Transform {
    constructor (options = {}) {
        super({ ...options })
        this.headerLine = true
        this.keys = []
        this.tailChunk = ''
    }

    _transform (chunk, encoding, callback) {
        const stringChunks = chunk.toString("utf8")
        const lines = stringChunks.split('\n')
        for(const line of lines) {
            const lineString = (this.tailChunk + line)
            let values = lineString.split(',')

            if(this.headerLine) {
                this.keys = values
                this.headerLine = false
                continue
            } 
            
            
            if(values.length !== this.keys.length || lineString[lineString.length - 1] === ',') {
                this.tailChunk = line
            } else {
                const chunkObject = {}

                this.keys.forEach((element, index) => {
                    chunkObject[element] = values[index]
                })

                this.tailChunk = ''
                this.push(`${JSON.stringify(chunkObject)}`)
            }
        }
        callback()
    }
    _flush(callback) {
        callback()
    }
    
}

module.exports = ObjectTranform