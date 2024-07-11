const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const corsOptions = {
    origin: 'https://apxmain.okcells.com.br',
    methods: ['GET', 'POST']
  };

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));

require("dotenv").config();
const PORT = process.env.PORT || 3002;


app.post('/', async (req, res) => {
  try {
    const dadosRecebidos = req.body;
    console.log(dadosRecebidos);
    const user = dadosRecebidos.lista.user;
    const pass = dadosRecebidos.lista.pass;
    const subject = dadosRecebidos.lista.subject;
    const text = dadosRecebidos.lista.text;
    const html = dadosRecebidos.lista.html;
    const email = dadosRecebidos.lista.email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    const destinatarios = email;

    const enviarEmail = async (to) => {
      const mailOptions = {
        from: user,
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado para: ' + to + ' - ' + info.response);
      } catch (error) {
        console.log(error);
      }
    };

    await Promise.all(destinatarios.map(enviarEmail));

    res.status(200).json({ message: 'Emails enviados com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  try {
      const htmlResponse = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API DE ENVIO DE EMAIL</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f2f2f2;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  color: #333;
              }
              .container {
                  max-width: 800px;
                  margin: 50px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  text-align: center;
                  margin-bottom: 20px;
              }
              p {
                  margin-bottom: 10px;
              }
              .author-info {
                  font-style: italic;
                  margin-top: 30px;
                  border-top: 1px solid #ccc;
                  padding-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>API DE ENVIO DE EMAIL</h1>
              <p>Data: 28/06/2024</p>
              <p>Descrição: A função serve para retornar ou enviar um email.</p>
              <div class="author-info">
                  <p>Autor: Henrique Silva Cruz - Ok Dados.</p>
              </div>
          </div>
      </body>
      </html>
      `;
      
  res.send(htmlResponse);

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
