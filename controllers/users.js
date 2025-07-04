const usersRouters = require('express').Router();
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {PAGE_URL} = require('../config');
//const { request } = require('../app');
const { token } = require('morgan');


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
            from: process.env.EMAIL_USER,
            to: savedUser.email,
            subject: "Verificacion de usuario",
            html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verify Mail</a>`,
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
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verificacion de usuario",
        html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verify Mail</a>`,
    });

    return res.status(400).json({error: 'El link ha expirado, verifica tu correo nuevamente para obtener el nuevo link.'})
 }
});

module.exports = usersRouters;