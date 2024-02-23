import fs from "fs";
import crypto from "node:crypto";
//import {ProductManager}  from "../../app.js";
export class CartManager{
  constructor(path){
    this.path=path;
    this.carts=[];
  };
  async getCartsFromDB() {
    try {
      //Lee el archivo
      const data = await fs.promises.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);
      return null;
    } catch (error) {
      if (error.errno === -4058) {
        console.error("El archivo no existe.");
        return null;
      }
      else {
        console.error("Error al leer el archivo.", error);
        return Promise.reject("Error al leer el archivo, " + error);
      }
    }
  }
  async getCart(id) {
    //Obtener los datos de la "base de datos" 
    const resultDB = await this.getCartsFromDB();
    
    if (resultDB !== null) return resultDB;

    //Busca en el arreglo de carritos si existe un carrito con el id del parámetro
    const cart = this.carts.find((c) => c.id === id);
    if (!cart) {
      //Si no existe el carrito, rechaza la promesa-
      console.error("El carrito no existe");
      return Promise.reject("El carrito no existe");
    }
    return cart;
  }

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
  getId() {
    this.LId = this.getLId();
    if (this.LId === 0) this.LId = 1;
    else this.LId++;
    return this.LId;
  }

  getLId() {
    if (this.products.length === 0) return 0;
    const LId = this.products[this.products.length - 1].id;
    console.log("the last id is ", LId);
    return LId;
  }

}
