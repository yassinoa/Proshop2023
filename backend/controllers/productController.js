import asyncHandler from "../middleware/asyncHandler.js";
import Product from '../models/productModel.js'


// @desc Fetch all product
// @route GET /api/products
// @acces Public
const getProducts = asyncHandler(async (req,res)=>{
  const pageSize=8
  const page=Number(req.query.pageNumber)||1
  const keyword=req.query.keyword ?{name:{$regex: req.query.keyword ,$options:'i'}} :{}
  const count=await Product.countDocuments({...keyword})
  console.log("count :",count,"keyword: ",keyword, "skip :",pageSize * (page -1))

  const products =await Product.find({...keyword})
    .limit(pageSize)
    .skip(pageSize * (page -1))
  res.json({products,page,pages: Math.ceil(count/pageSize)})
})

// @desc Fetch all product
// @route GET /api/products/:id
// @acces Public
const getProductById = asyncHandler(async (req,res)=>{
  const product=await Product.findById(req.params.id)
  if (product){
    return res.json(product)
  }else{
    res.status(404)
    throw new Error('Product not found')
  } 
})

// @desc Create a product
// @route POST /api/products
// @acces Private/admin
const createProduct = asyncHandler(async (req,res)=>{
  const {name , price, description,image,brand,category,countInStock}=req.body
  const product= new Product({
    name,
    price,
    user:req.user._id,
    image: image || '/images/sample.jpg',
    brand,
    category,
    countInStock,
    numReviews:0,
    description
  })
  console.log(product)
  const createdProduct=await product.save()
  res.status(201).json(createdProduct) 
})
// @desc Fetch a product
// @route PUT /api/products/:id
// @acces Private/Admin
const updateProduct = asyncHandler(async (req,res)=>{
  const {name , price, description,image,brand,category,countInStock}=req.body
  const product= await Product.findById(req.params.id)
  if(product){
    product.name=name
    product.price=price
    product.description=description
    product.image=image
    product.brand=brand
    product.category=category
    product.countInStock=countInStock

    const updatedProduct=await product.save()
    res.json(updatedProduct)
  }else{
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @desc delete a product
// @route delete /api/products/:id
// @acces Private/Admin
const deleteProduct = asyncHandler(async (req,res)=>{
  const product =await Product.findById(req.params.id)
  if(product){
    await Product.deleteOne({_id:product._id})
    res.status(200).json({message:'Product deleted'})
  }else{
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @desc create a new review
// @route POST /api/products/:id/reviews
// @acces Private
const createProductReview = asyncHandler(async (req,res)=>{
  const {rating,comment}=req.body
  console.log(rating , comment)
  const product =await Product.findById(req.params.id)
  if(product){
    const alreadyReviewed=product.reviews.find(
      (review)=>review.user.toString()=== req.user._id.toString()
    )
    if(alreadyReviewed){
      res.status(404)
      throw new Error('Product already reviewed')
    }
    // console.log(String(req.user._id))
    const review={
      name:req.user.name,
      rating:Number(rating),
      comment,
      user: req.user._id
    }
    product.reviews.push(review)
    product.numReviews=product.reviews.length
    product.rating= product.reviews.reduce((acc,review)=>acc+review.rating,0)/
                    product.reviews.length
    // console.log(product)
    await product.save()
    res.status(200).json({message:'Review added'})
  }else{
    res.status(404)
    throw new Error('Resource not found')
  }
})


// @desc Get Top rated products
// @route GET /api/products/top
// @acces Public
const getTopProducts = asyncHandler(async (req,res)=>{
  const products=await Product.find({}).sort({rating:-1}).limit(3)
  res.status(200).json(products)
 
})

export {getProducts,getProductById,createProduct,updateProduct,deleteProduct,createProductReview,getTopProducts}