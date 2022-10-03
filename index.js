const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const multer = require("multer");
const tableName = 'Paper';
const upload = multer();

app.use(express.static('./template'))
app.set('view engine', 'ejs')
app.set('views', 'template')

AWS.config.update({
    accessKeyId:'AKIA34KECLYEL2WGGHN2',
    secretAccessKey:'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',
    region:'ap-southeast-1'
})

const docClient = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    }
    docClient.scan(params, (err, data) => {
        if(err){
            return res.send('Loi'+err);
        }
        return res.render('index', {data: data.Items})
    })
})

app.get('/them', (req, res) => {
    res.render('them')
})

app.post('/', upload.fields([]), (req, res)=> {
    const { stt, tenBaiBao, tenNhomTacGia, ISBN, soTrang, namXB} = req.body
    const params = {
        TableName: tableName,
        Item: {
            stt,
            tenBaiBao,
            tenNhomTacGia,
            ISBN,
            soTrang,
            namXB
        }
    }
    docClient.put(params, (err, data) => {
        if(err){
            return res.send('Loi')
        }
        return res.redirect('/')
    })
})

app.post('/delete', upload.fields([]), (req, res)=> {
    const { stt} = req.body
    const params = {
        TableName: tableName,
        Key: {
            stt
        }
    }
    docClient.delete(params, (err, data) => {
        if(err){
            return res.send('Loi')
        }
        return res.redirect('/')
    })
})

app.listen(8000, () => {
    console.log('Backend is running');
})