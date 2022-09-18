const FileProcessor = require('./fileProcessor')
const JsonTransform = require('./jsonTransform')
const MonitorTransform = require('./monitorTransform')
const ObjectTranform = require('./objectTransform')
const { createGzip } = require('node:zlib')
const CloudStorageFileService = require('./cloudStorageFileService')
const ProgressPass = require('./progressPass')
const fileProcessor = new FileProcessor()
const cloudFileService = new CloudStorageFileService()


const gzip = createGzip()


const bucketName = 'myfileuploads'
const fileName = 'london_crime_by_lsoa2.csv'
const destFileName = 'london_crime_by_lsoa2.tar.gz'


;
(async () => {
    try {
        const fileSize = await cloudFileService.getFileSize(bucketName, fileName)
        await fileProcessor
        .setReadable(await cloudFileService.downloadFile(bucketName, fileName))
        .addTransforms([new ProgressPass(fileSize), new ObjectTranform(), new MonitorTransform(), new JsonTransform(), gzip])
        .setWritable(await cloudFileService.uploadFile(bucketName, destFileName))
        .execute()
    } catch (e) {
        console.log(e)
    }
})()
