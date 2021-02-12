import { Component, OnInit } from '@angular/core';

import { ProductsService } from '../../../services/products.service';

import { Path } from '../../../config';
import { OwlCarouselConfig, BackgroundImage } from '../../../functions';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {

  path:String = Path.url;
  banner_home: Array<any> =[];
  category: Array<any> =[];
  url: Array<any> =[];
  render:Boolean = true;
  preload:Boolean = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.preload = true;

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
            /* console.log('resp',resp); */

            let i;
            for(i in resp){
              this.banner_home.push(JSON.parse(resp[i].horizontal_slider))
              /* console.log('this.banner_home',this.banner_home); */
              this.category.push(resp[i].category)
              this.url.push(resp[i].url)
              this.preload = false;
            }
          })
        })
  }

   /* Funcion que nos avisa el renderizado de ANGULAR */
   callback(){
     if (this.render){
       this.render = false;
       
       OwlCarouselConfig.fnc();
       BackgroundImage.fnc();
     }
   }

}
