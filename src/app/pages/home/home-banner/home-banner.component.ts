import { Component, OnInit } from '@angular/core';

import { ProductsService } from '../../../services/products.service';

import { Path } from '../../../config';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {

  path:String = Path.url;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    let index = 0;

    this.productsService.getData()
        .subscribe(resp =>{
         /*  console.log('resp',resp); */

        /* Tomar la logitud del objeto */
        let i;
        let size = 0;
        for(i in resp){
          size ++

        }
          /* console.log('size',size); */
          /* Devolver un Baner aleatorio */

          if(size > 5){

            index = Math.floor(Math.random()*(size-5)); 
            /* console.log('index',index); */
          }

          /* Seleccionar data de los productos con limites */

         
        
          this.productsService.getLimitData(Object.keys (resp)[index], 5 )

          .subscribe(resp =>{
            console.log('resp',resp);
          })
        })
  }

}
