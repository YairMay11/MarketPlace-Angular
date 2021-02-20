import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css']
})
export class HomeHotTodayComponent implements OnInit {

  path:String = Path.url;
  indexes:Array<any> = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;
    

    /* TOMAMOS LA DATA DE LOS PRODUCTOS */
    this.productsService.getData()
        .subscribe(resp =>{

          /* console.log('resp',resp); */

          /* Recorremos cada producto para separar las ofertas y el stock */
          let i;

          for (i in resp){

            getProducts.push({
              "offer": JSON.parse(resp[i].offer),
              "stock": resp[i].stock
            })
            /* console.log('getProducts',getProducts); */

          }
          /* RECORREMOS CADA OFERTA Y STOCK PARA CLASIFICAR LAS OFERTAS ACTUALES 
          Y LOS PRODUCTOS QUE SI TENGAN EL STOCK */

          for(i in getProducts){

            fechaOferta = new Date(
              /* GENERAR FECHA DE LA OFERTA */
              parseInt(getProducts[i]["offer"][2].split("-")[0]),
              parseInt(getProducts[i]["offer"][2].split("-")[1])-1,
              parseInt(getProducts[i]["offer"][2].split("-")[2])
    
            )
    
            if(hoy < fechaOferta && getProducts[i]["stock"] > 0){
    
              this.indexes.push(i);
              console.log('this.indexes',this.indexes);
    
            }
    
    
          }

        })
  }

}
