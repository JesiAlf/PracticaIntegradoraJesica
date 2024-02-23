import fs from "fs";

export class ProductManager {
  constructor() {
    this.products = [];
    this.path = "";
  }
  
  async addProduct(newProduct) {
    //obtengo los archivos mandando a llamar al getProduct para q mi arreglo de getproduct este acrttualizado y verificar que el codigo no se repita
    await this.getProduct();
  
    //si dentro del arreglo tengo un producto con el mismo codigo, manda un mensaje de error
    if (
    this.products.some((product) => product.code === newProduct.code) &&
    this.products.some((product) => product.title === newProduct.title)
    ){
        console.log(
          `El producto "${newProduct.title}" ya existe, no se agregará a la lista.`
        );
        return Promise.reject(
          `El producto "${newProduct.title}" ya existe, no se agregará a la lista.`
        );
      }
    //Si el codigo del producto ya existe rechaza la promesa y manda un mensaje para que se cambie el código.
    if (this.products.some((product) => product.code === newProduct.code)){
        console.log(
          `El codigo "${newProduct.code}" ya existe, favor de cambiarlo en el producto "${newProduct.title}".`
        );
        return Promise.reject(
          `El codigo "${newProduct.code}" ya existe, favor de cambiarlo en el producto "${newProduct.title}".`
        );
    }
    //crear el id para un nuevo producto
    const id = this.getId();
    const product = { id, ...newProduct,status };
    //coloco en el arreglo el objeto producto desparramado mas el id
    this.products.push(product);

    try {
      await fs.writeFile(this.path, JSON.stringify(this.products));
      return product;
      //console.log("saved data successfully");
    } catch (error) {
      console.error("An error occurred while reading the files", error);
    }
  }

  async getProduct() {
    try {
        //lectura el archivo json
      const data = await fs.promises.readFile(this.path, "utf8");
      //el archivo como va a contener texto, tengo que parcearlo para que vuelva a hacer un arreglo de objetos y se lo asignamos a nuestros arreglo de productos el que se sobreescribe con lo q tenga el archivo y se actualiza, cada vez q se llame al getproducts
      this.products = JSON.parse(data);

    } catch (error) {
      console.error("An error occurred while reading the files", error);
    return [];
    }
    return this.products;
  }
  

  async getProductById(id) {
   await this.getProduct();

    const product = this.products.find((product) => product.id === id);
    if (product === undefined) {
      console.log(`the product with the ID ${id} not exist`);
    } else return product;
  }
  //creo id unico y creo una variable this.getid y si ya existe, le sumo un numero e incrementando el id a medida q se ingrese si ya existe
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

  async updateProduct(id, productoActual) {
    await this.getProduct();
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(`the ID ${id} noy exist`);
      return;
    }
    const indice = this.products.findIndex((product) => product.id === id);
    this.products[indice] = { id, ...productoActual };

    try {
      await fs.writeFile(this.path, JSON.stringify(this.products));
      return newProduct;
      //console.log("field actually");
    } catch (error) {
      console.error("the field didnt actually", error);
    }
  }

  async deleteProduct(id) {
   await this.getProduct();
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(`the ID ${id} noy exist`);
      return;
    }

    const indice = this.products.findIndex((product) => product.id === id);
    this.products.splice(indice, 1);
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products));
      console.log("delete product");
    } catch (error) {
      console.error("mistake to delete", error);
    }
  }
}

