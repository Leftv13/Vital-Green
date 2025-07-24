const usersRouters = require('express').Router();
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {PAGE_URL} = require('../config');
//const { request } = require('../app');
const { token } = require('morgan');

const createVerificationEmailHTML = (userId, token) => {
  const verificationLink = `${PAGE_URL}/verify/${userId}/${token}`;
  // La URL del logo debe ser pública y accesible desde internet.
  // He subido tu logo a un hosting de imágenes para que funcione.
  const logoUrl = 'https://i.ibb.co/L9wLzht/VITALGREEN-SINFONDO.png';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="Vital Green Logo" style="max-width: 150px;">
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="color: #4CAF50;">¡Casi listo! Confirma tu correo electrónico</h2>
        <p>Hola,</p>
        <p>Gracias por registrarte en Vital Green. Estamos muy contentos de tenerte. Solo falta un paso más para activar tu cuenta.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verificar mi cuenta</a>
        </p>
        <p>Si no creaste esta cuenta, puedes ignorar este correo de forma segura.</p>
        <br>
        <p>¡Gracias!<br><strong>El equipo de Vital Green</strong></p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} Vital Green. Todos los derechos reservados.
      </div>
    </div>
  `;
};

usersRouters.post('/' , async (req, res) =>{

  
    const { name, email, password, phoneNumber } = req.body;

    
if (!name || !email || !password || !phoneNumber){ 
    return res.status(400).json({message: "Todos los campos son obligatorios"});
}

    try {
        
        const userExist = await User.findOne({ email });

        if (userExist) {
            
            return res.status(409).json({ message: "Este email ya está en uso" }); 
        }

       
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            passwordHash,
            phoneNumber
        });

        const savedUser = await newUser.save();

      
        const token = jwt.sign({id: savedUser.id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "20m"
        });
        
           const emailHTML = createVerificationEmailHTML(savedUser.id, token);

           const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        await transporter.sendMail({
            from: `"Vital Green" <${process.env.EMAIL_USER}>`,
            to: savedUser.email,
            subject: "Verificación de Cuenta - Vital Green",
            html: emailHTML,
        });

        return res.status(201).json({ message: "Usuario creado. Por favor verifica tu correo." });

    } catch (error) {      
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el usuario.', error: error.message });
    }
});

usersRouters.patch('/:id/:token' , async (req, res) =>{
 try {
   
    const token = req.params.token;
    
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const id = decodedToken.id;
  await User.findByIdAndUpdate(id, {verified: true});
  return res.sendStatus(200);
 } catch (error) {
    //Encontrar el mail del usuario
    const id = req.params.id;
    const {email} = await User.findById(id);
    //Firmar el nuevo token
    const token = jwt.sign({id: id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m"
    });
    
    const emailHTML = createVerificationEmailHTML(id, token);

    //Enviar el email
   
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    
    await transporter.sendMail({
        from: `"Vital Green" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Nuevo Link de Verificación - Vital Green",
        html: emailHTML,
    });

    return res.status(400).json({error: 'El link ha expirado, verifica tu correo nuevamente para obtener el nuevo link.'})
 }
});

module.exports = usersRouters;