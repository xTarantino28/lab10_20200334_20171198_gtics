const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:63342',
    optionSuccessStatus:200
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors(corsOptions));

const upload = multer({ dest: 'storage/' });


app.post('/uploadImages', upload.any(), (req, res) => {
    const files = req.files;
    const data = [];

    if (!fs.existsSync('./storage')) {
        fs.mkdirSync('./storage');
    }

    const uploadDir = path.join(__dirname, 'storage');

    Object.entries(req.files).forEach(([key, file]) => {
        const thumbnail_id = file.fieldname;
        //const pathInfo = path.parse(file.originalname);
        const photoName = file.originalname;

        const destPath = path.join(uploadDir, photoName);

        fs.copyFileSync(file.path, destPath);
        fs.unlinkSync(file.path);

        data.push({ id: thumbnail_id, file_name: photoName });
    });

    fs.writeFile('database.json', JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error al escribir en database.json', err);
            return res.status(500).json({ message: 'No fue posible subir los archivos' });
        }

        const count = data.length;
        const message = count > 1 ? `Se subieron ${count} fotos con éxito` : `Se subió ${count} foto con éxito`;

        return res.status(200).json({ message, data });
    });
});




function strRandom(pathInfo) {
    const characters = 'AaBbCcDdEeFfGgHhIiJjKkLlMm0123456789_';
    const randomString = [...Array(16)]
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join('');

    return randomString + '' + pathInfo.ext;
}

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
