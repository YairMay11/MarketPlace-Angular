import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home-promotions',
  templateUrl: './home-promotions.component.html',
  styleUrls: ['./home-promotions.component.css']
})
export class HomePromotionsComponent implements OnInit {

  path:String = Path.url;
  banner_default: Array<any> =[];
  category: Array<any> =[];
  url: Array<any> =[];
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

          if(size > 2){

            index = Math.floor(Math.random()*(size-2)); 
            /* console.log('index',index); */
          }

          /* Seleccionar data de los productos con limites */

         
        
          this.productsService.getLimitData(Object.keys (resp)[index], 2 )

          .subscribe(resp =>{
            /* console.log('resp',resp); */

            let i;
            for(i in resp){
              this.banner_default.push(resp[i].default_banner)
              /* console.log('this.banner_default',this.banner_default); */
              this.category.push(resp[i].category)
              this.url.push(resp[i].url)
              this.preload = false;
            }
          })
        })
  }

}
