const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken')
const { JWT_SIGN } = require('../config/jwt.js')


const getAllProducts = async (req, res) => {
  const token = req.cookies.access_token;
  const decodedToken = jwt.verify(token, JWT_SIGN)

  let query = { product, description: decodedToken.username }

  if (decodedToken.role === "admin" || decodedToken.role === "user") {
    query = {}
  }

  try {
    const product = await req.db.collection('product').find(query).toArray();
    res.status(200).json({
      message: 'Product successfully retrieved',
      data: product
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createProduct = async (req, res) => {
  const token = req.cookies.access_token
  const { product } = req.body
  const decodedToken = jwt.verify(token, JWT_SIGN)

  try {
    const newProduct = await req.db.collection('product').insertOne({ product, description: decodedToken.username })
    
    res.status(200).json({
      message: 'Product successfully created',
      data: newProduct
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateProduct = async (req, res) => {
  const token = req.cookies.access_token
  const { id } = req.params
  const { products } = req.body
  const decodedToken = jwt.verify(token, JWT_SIGN)
  
  console.log(req.query, `<=================== query ==================`);
  
  try {
    const product = await req.db.collection('product').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { products } })

    if (decodedToken.username !== product.product) {
      return res.status(403).json({
        message: 'you are not allowed to update',
        success : 'false'
      })
    }
    res.status(200).json({
      message: 'Product updated',
      data: product
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

  const deleteProduct = async (req, res) => {
  const token = req.cookies.access_token
  const { id } = req.params
  const decodedToken = jwt.verify(token, JWT_SIGN)
  
  console.log(req.query, `<=================== query ==================`);
  
  try {
    const product = await req.db.collection('product').findOneAndDelete({ _id: new ObjectId(id) })

    if (decodedToken.username !== product.product) {
      return res.status(403).json({
        message: 'you are not allowed to delete',
        success : 'false'
      })
    }
    
    if (!product) {  
      res.status(404).json({
        message: 'Product not found',
        data: null
      });
    } else {
      res.status(200).json({
        message: 'Product deleted',
        data: book
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}