const { PassThrough } = require('stream')

class ProgressPass extends PassThrough {
    constructor(fileSize, options = {}) {
        super({ ...options })
        this.on('data', this.processData)
        this.on('progress', this.showResult)
        this.on('close', this.finishProgress)
        this.bytesRead = 0
        this.progress = 0
        this.fileSize = fileSize
        this.createProgressBar()
    }

    processData(data) {
        this.bytesRead += data.length
        this.progress = (this.bytesRead / this.fileSize) * 100
        this.emit('progress', Math.floor(this.progress))
    }

    createProgressBar() {
        process.stdout.write("\x1B[?25l")
        process.stdout.write('[')
        for(let i = 1; i <= 101; i++) {
            process.stdout.write('-')
        }
        process.stdout.write(']')
    }
    showResult(progress) {
        process.stdout.cursorTo(progress+1)
        process.stdout.write('=')
        

        process.stdout.cursorTo(105)
        process.stdout.write(`${progress}%`)
        
    }

    finishProgress() {
        process.stdout.write("\x1B[?25h")
        process.stdout.write("\n")
    }
}


module.exports = ProgressPass