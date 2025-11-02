export interface Product {
  id?: string;
  "#": number;
  "Product Name": string;
  "Product code": string;
  EAN: string;
  "Color ID": string;
  Color: string;
  "Wholesale price": number;
  "Retail price": number;
  "Available stock": number;
}
export interface ProductsResponse {
  products: Product[];
}