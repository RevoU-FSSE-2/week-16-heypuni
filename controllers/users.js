const bcrypt = require('bcrypt')
const cache = require('memory-cache')
const jwt = require('jsonwebtoken')
const { JWT_SIGN } = require('../config/jwt.js')
const StandardError = require('../utils/standard-error.js');
const { addDays } = require("date-fns");


const sendEmail = (email, key) => {
  console.log(`Subject: Password reset request`);
  console.log(`To: ${email}`);
  console.log(`Body: hit me, http://localhost:5001/reset?key=${key}`);

};

const registerService = async (req, email, username, password, role) => {
  const user = await req.db.collection('user').findOne({ username })
    
  if (user) {
    throw new Error('Username already exists')
  } 
  
  const hashedPassword = await bcrypt.hash(password, 8) 
  const newUser = await req.db.collection('user').insertOne({ email, username, password: hashedPassword, role})
  
  return newUser
}

const register = async (req, res, next) => {
  const { email, username, password, role} = req.body
  
  try {
    const newUser = await registerService(req, email, username, password, role)
    
    res.status(200).json({
      message: 'User successfully registered',
      data: newUser,
    })
  } catch (error) {
    const standardError = new StandardError({
      message: error.message || 'Error while registering user',
      status: 500
    })
    next(standardError)
  }
}

const login = async (req, res) => {
  const { username, password } = req.body
  const user = await req.db.collection('user').findOne({ username });
  
  const isPasswordCorrect = await bcrypt.compare(password, user.password) 
  
  if (isPasswordCorrect) {
    
    const accessToken = jwt.sign({ username: user.username, id: user._id, role: user.role }, JWT_SIGN, { expiresIn: "10m"})
    const refreshToken = jwt.sign({ username: user.username, id: user._id, role: user.role }, JWT_SIGN, { expiresIn: "7d"})
    const accessTokenExpiration = addDays(new Date(), 600);
    
    res.cookie("access_token", accessToken, {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({
      message: 'User successfully logged in',
      data: {
        accessToken,
        refreshToken,
        accessTokenExpiration
      }
    })
  } else {
    res.status(400).json({ error: 'Password is incorrect' })
  }
  
}

const logout = async (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(200).json({message: "Successfully Log Out"});
}

const passwordResetRequest = async (req, res) => {
      
      const { email } = req.body;
      const user = await req.db.collection('user').findOne({ email });
      console.log(user);
      if (!user) {
        res.status(400).json({ error: "some error" });
        return;
      }
      const key = Math.random().toString(36).substring(2, 15);
      
      cache.put(key, user.email, 5 * 60 * 1000);
      sendEmail(user.email, key);
      res.json({ message: "Password reset email sent" });
}

const passwordReset = async (req, res) => {
  const { password } = req.body;
  const { key } = req.query;
  const email = cache.get(key); 
  console.log(key);
  console.log(email)
  console.log(cache.keys());
  if (!email) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
 
const usersCollection = req.db.collection('user'); 
const user = await usersCollection.findOne({ email });

if (!user) {
  res.status(400).json({ error: "User not found" });
  return;
}

const hashedPassword = await bcrypt.hash(password, 8) 

await usersCollection.updateOne(
  { email: user.email }, 
  { $set: { password: hashedPassword } } 
);
  cache.del(key);
  res.json({ message: "Password reset success" });
}


module.exports = {
  register,
  login,
  logout,
  passwordResetRequest,
  passwordReset
}