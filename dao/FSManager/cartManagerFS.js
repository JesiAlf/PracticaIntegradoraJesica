import fs from "fs";
import crypto from "node:crypto";
//import {productManager}  from "../../../src/app.js";

export class CartManager{
  constructor(){
    this.path="./src/data/carts.json";
    this.carts=[];
  };

  getCart(){
    try {
      const data=fs.readFileSync(this.path, "utf8");
      this.carts=JSON.parse(data);
      console.log("Las carts se cargaron exitosamente:", this.carts)
    } catch (error) {
      console.error("error de carts:", error);
      return[];
      }
};

  addCart(){
    //this.getCart()
    const newCart={
      id: crypto.randomUUID(),
      products:[],
    };
    this.carts.push(newCart);

    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2));
      console.log("cart save succefull!");
      return newCart;
    } catch (error) {
      console.error("the carts couldnt save succefull", error);
      return null;
    
  }
};

  getCartById(cId) {
    this.getCart();

    const cart = this.carts.find((cart) => cart.id === cId);
    if (cart === undefined) {
      console.log(`the product with the ID ${cId} not exist`);
      return null;
    } else {
      console.log("cart not find");
      return cart;
    }
  };

  addProduct(cId,pId) {
    this.getCart();
    const cart = this.carts.find((cart) => cart.id === cId);
    if (!cart) {
      console.log(`the cart with the ID ${cId} not find`);
      return;
    }

    const productValid= this.products.find((p)=>p.id===pId);
    if (!productValid) {
      console.log("the code already exists");
      return;
    }

    cart.products.push({ pid : pId});

    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2));
      console.log("saved data successfully");
    } catch (error) {
      console.error("An error occurred while reading the files", error);
    }
  };

  deleteProduct(cId, pId) {
    this.getCart();
    if (this.carts.find((cart) => cart.id === cId) === undefined) {
      console.error(`the ID ${cId} not exist`);
      return;
    }
    const indice= cart.products.findIndex((product) => product.pid === pId);
    if (indice === -1) {
      console.error(`El producto con ID ${pId} no existe en el carrito`);
      return;
    }

    cart.products.splice(indice, 1);
    /*const indice = this.carts.findIndex((cart) => cart.id === id);
    this.carts.splice(indice, 1);*/
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2));
      console.log("delete product");
    } catch (error) {
      console.log("mistake to delete", error);
    }
  };

  deleteCart (cId){
    this.getCart();
    if (this.carts.find((cart) => cart.id === cId) === undefined) {
      console.error(`the ID ${cId} not exist`);
      return;
    }

    const indice = this.carts.findIndex((cart) => cart.id === cId);
    this.carts.splice(indice, 1);
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2));
      console.log("delete cart");
    } catch (error) {
      console.log("mistake to delete", error);
    }
  };

}
