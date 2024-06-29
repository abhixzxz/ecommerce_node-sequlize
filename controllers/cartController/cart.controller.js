import Cart from "../../models/cartModel/cartModel.js";
import Product from "../../models/productModel/product.model.js";
import User from "../../models/userModel/user.model.js";

// Add an item to the cart
export const addItemToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let productImage = null;
    if (Array.isArray(product.image_url)) {
      productImage = product.image_url[0];
    } else if (typeof product.image_url === "string") {
      productImage = JSON.parse(product.image_url)[0];
    }

    const cartItem = await Cart.create({
      user_id,
      product_id,
      quantity,
      product_image: productImage,
    });

    res.status(201).json({
      message: "Item added to cart successfully",
      status: 201,
      data: cartItem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding item to cart: " + error.message });
  }
};

export const getCartItems = async (req, res) => {
  const { user_id } = req.params;

  try {
    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          attributes: ["name", "description", "price"],
        },
      ],
    });

    const formattedCartItems = cartItems.map((item) => ({
      ...item.toJSON(),
      product_name: item.Product.name,
      product_description: item.Product.description,
      price: item.Product.price,
    }));

    res.status(200).json({
      message: "Cart items retrieved successfully",
      status: 200,
      data: formattedCartItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving cart items: " + error.message });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req, res) => {
  const { cart_id, quantity } = req.body;

  if (!cart_id || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const cartItem = await Cart.findByPk(cart_id);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      message: "Cart item updated successfully",
      status: 200,
      data: cartItem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating cart item: " + error.message });
  }
};

// Remove an item from the cart
export const removeItemFromCart = async (req, res) => {
  const { cart_id } = req.params;

  try {
    const cartItem = await Cart.findByPk(cart_id);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.status(200).json({
      message: "Cart item removed successfully",
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error removing cart item: " + error.message });
  }
};
