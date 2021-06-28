import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';

import { OwlCarouselConfig, CarouselNavigation } from '../../../functions'

import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-best-sales-item',
  templateUrl: './best-sales-item.component.html',
  styleUrls: ['./best-sales-item.component.css']
})
export class BestSalesItemComponent implements OnInit {

  path: String = Path.url;
  bestSalesItem:Array<any> = [];
  render:Boolean = true;

  constructor(private productsService: ProductsService,
    private activateRoute: ActivatedRoute,) { }

  ngOnInit(): void {

    /* Capturamos el parametro de la URL */

    let params = this.activateRoute.snapshot.params["param"];

    /* FILTRAMOS LA DATA DE PRODUCTOS CON CATEGORIAS */
    this.productsService.getFilterData("category", params)
      .subscribe(resp1 => {

        if (Object.keys(resp1).length > 0) {

          let i;

          for (i in resp1) {
            this.productsFnc(resp1);
          }
        } else {
          /* FILTRAMOS LA DATA DE CATEGORIAS */
          this.productsService.getFilterData("sub_category", params)
            .subscribe(resp2 => {

              let i;

              for (i in resp2) {
                this.productsFnc(resp2);


              }
            })
        }
        /* console.log('resp',resp); */
      })

    
  }

  /* DECLARAMOS LA FUNCION PARA LAS MEJORES VENTAS */
  productsFnc(response){
    this.bestSalesItem= [];
    /* HACEMOS UN RECORRIDO POR LA RESPUESTA QUE NOS 
       TRAIGA EL FILTRADO */
    let i;
    let getSales = []; 
    for(i in response){
        getSales.push(response[i]);
        /* console.log('getSales',getSales); */
    }

    /* ORDENAMOS DE MAYOR A MENOR VENTAS EL ARREGLO DE OBJETOS */
    getSales.sort(function(a,b){
      return(b.sales - a.sales)
      })
      /* console.log('getSales',getSales); */

      /* FILTRAMOS HASTA 10 PRODUCTOS */

      getSales.forEach((product, index)=>{
        if(index < 10){
          this.bestSalesItem.push(product);
        }
      })

  }

  callback(){

    if(this.render){
      this.render = false;
      OwlCarouselConfig.fnc();
    CarouselNavigation.fnc();
    }

  }

}
