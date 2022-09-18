const { pipeline } = require('stream/promises')

class FileProcessor {
    constructor() {
        this.readableStream = null
        this.transforms = []
        this.writableStream = null
    }

    setReadable(readableStream) {
        this.readableStream = readableStream
        return this
    }

    addTransforms(transformsStream) {
        this.transforms = transformsStream
        return this
    }

    setWritable(writableStream) {
        this.writableStream = writableStream
        return this
    }

    async execute() {
        try {
            if(!this.readableStream) {
                throw Error('Readable stream not implemented')
            }
            if(!this.writableStream) {
                throw Error('Writable stream not implemented')
            }
            await pipeline(this.readableStream, ...this.transforms, this.writableStream)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = FileProcessor