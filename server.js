const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());


let nivel = 1;
let dias = 6;
let coin = 2;
let hachas = 0;
let madera = 0;
let hierro = 0;
let menaoro = 0;
let lingoteoro = 0;
let anillo = 0;
let corona = 0;

app.get('/recursos', (req, res) => {
    res.json({
        nivel: nivel,
        dias: dias,
        coin: coin,
        hachas: hachas,
        madera: madera,
        hierro: hierro,
        menaoro: menaoro,
        lingoteoro: lingoteoro,
        anillo: anillo,
        corona: corona
    });
});

app.put('/recursos', (req, res) => {
    const { variable, valor } = req.body;

    if (variable === 'coin'){
        coin += valor;
    } else if (variable === 'hachas'){
        hachas += valor;
    }else if (variable === 'madera'){
        madera += valor;
    }else if (variable === 'dias'){
        dias += valor;
    }else if (variable === 'nivel'){
        nivel += valor;
    }else if (variable === 'hierro'){
        hierro += valor;
    }else if (variable === 'menaoro'){
        menaoro += valor;
    }else if (variable === 'lingoteoro'){
        lingoteoro += valor;
    }else if (variable === 'anillo'){
        anillo += valor;
    }else if (variable === 'corona'){
        corona += valor;
    }
    res.json({ coin, hachas, madera, dias, nivel, hierro, menaoro, lingoteoro, anillo, corona});
});

app.put('/recursos/set', (req, res) => {
    const { variable, valor } = req.body;

    if (variable === 'coin'){
        coin = valor;
    } else if (variable === 'hachas'){
        hachas = valor;
    }else if (variable === 'madera'){
        madera = valor;
    }else if (variable === 'dias'){
        dias = valor;
    }else if (variable === 'nivel'){
        nivel = valor;
    }else if (variable === 'hierro'){
        hierro = valor;
    }else if (variable === 'menaoro'){
        menaoro = valor;
    }else if (variable === 'lingoteoro'){
        lingoteoro = valor;
    }else if (variable === 'anillo'){
        anillo = valor;
    }else if (variable === 'corona'){
        corona = valor;
    }
    res.json({coin, hachas, madera, dias, nivel, hierro, menaoro, lingoteoro, anillo, corona});
});

app.listen(port,() => {
    console.log(`Servidor corriendo en http:/localhost:${port}`);
});